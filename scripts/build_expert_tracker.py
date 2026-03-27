#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from datetime import datetime, timezone
from html import unescape
from pathlib import Path
from typing import Iterable
from urllib.parse import urljoin, urlparse

import requests
import urllib3
from bs4 import BeautifulSoup
from requests.exceptions import SSLError


urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE_PATH = REPO_ROOT / "other/research-experts/bookmarks-data.js"
OVERRIDES_PATH = REPO_ROOT / "other/research-experts/experts-overrides.json"
OUTPUT_PATH = REPO_ROOT / "other/research-experts/experts-data.js"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/136.0.0.0 Safari/537.36"
    )
}
TIMEOUT = 20
MAX_WORKERS = 10

RESEARCH_HINTS = ("research", "publication", "working", "paper", "project")
BROKEN_HINTS = (
    "error connectyourdomain occurred",
    "google drive: sign-in",
    "sign in - google accounts",
    "just a moment...",
    "enable javascript and cookies to continue",
    "404 the page you have entered does not exist",
)
GENERIC_NAME_PHRASES = {
    "about me",
    "home",
    "home page",
    "personal website",
    "research",
    "research page",
    "welcome",
    "welcome to my homepage",
}
PAPER_STOP_TITLES = {
    "about cepr discussion papers",
    "article share, full-text access",
    "article share, with fulltext",
    "coverage",
    "curriculum vitae",
    "econpapers (repec)",
    "google scholar",
    "home",
    "media",
    "more home research",
    "more home research teaching",
    "more use tab to navigate through the menu items",
    "office hours",
    "paper link",
    "poster",
    "research summary",
    "resources / public goods",
    "skip to main content",
    "slides",
    "view selected publications",
    "working papers and others",
}
PAPER_STOP_PATTERNS = [
    re.compile(pattern, re.IGNORECASE)
    for pattern in (
        r"^aea research highlights$",
        r"^american economic review[, ]",
        r"^article share",
        r"^economics letters[, ]",
        r"^google drive",
        r"^google scholar profile here$",
        r"^home research",
        r"^imperial college london$",
        r"^journal of ",
        r"^[a-z .'-]+ university$",
        r"^miguel ortiz serrano$",
        r"^more home",
        r"^nber working paper \d+$",
        r"^quarterly journal of economics",
        r"^review of ",
        r"^science \d",
        r"^the economist$",
        r"^working papers?:?$",
    )
]
FIELD_RULES = {
    "Development": [
        r"\bdevelopment economics?\b",
        r"\bpoverty\b",
        r"\blow-income countries?\b",
        r"\bglobal development\b",
        r"\bmicrofinance\b",
        r"\bhousehold\b",
    ],
    "Labor": [
        r"\blabou?r economics?\b",
        r"\blabou?r market\b",
        r"\bemployment\b",
        r"\bwages?\b",
        r"\bhuman capital\b",
        r"\bmigration\b",
        r"\bpersonnel economics\b",
    ],
    "Econometrics": [
        r"\beconometrics?\b",
        r"\bcausal inference\b",
        r"\bdifference[- ]in[- ]differences\b",
        r"\bevent stud(y|ies)\b",
        r"\btreatment effects?\b",
        r"\bidentification\b",
        r"\binference\b",
        r"\binstrumental variables?\b",
    ],
    "Trade": [
        r"\binternational trade\b",
        r"\btrade\b",
        r"\bexports?\b",
        r"\bimports?\b",
        r"\bglobal value chains?\b",
        r"\btariff",
    ],
    "Political Economy": [
        r"\bpolitical economy\b",
        r"\binstitutions?\b",
        r"\bgovernance\b",
        r"\bconflict\b",
        r"\bstate capacity\b",
        r"\bpolarization\b",
    ],
    "Macro": [
        r"\bmacroeconomics?\b",
        r"\bbusiness cycles?\b",
        r"\bmonetary policy\b",
        r"\binflation\b",
        r"\bfiscal\b",
        r"\bcommodities\b",
        r"\bexchange rate\b",
    ],
    "Environment / Energy": [
        r"\bclimate\b",
        r"\benvironment(?:al)?\b",
        r"\benergy\b",
        r"\bpollution\b",
        r"\bemissions?\b",
        r"\bdeforestation\b",
    ],
    "Public Economics": [
        r"\bpublic economics?\b",
        r"\btax(?:ation)?\b",
        r"\bredistribution\b",
        r"\bwelfare\b",
        r"\bsocial insurance\b",
    ],
    "Urban / Spatial": [
        r"\burban economics?\b",
        r"\bspatial\b",
        r"\bgeography\b",
        r"\bcities\b",
        r"\bhousing\b",
        r"\bplace-based\b",
    ],
    "Organization / Personnel": [
        r"\borganizational economics?\b",
        r"\borganisation(?:al)? economics?\b",
        r"\bmanagement\b",
        r"\bpersonnel economics\b",
        r"\bfirms?\b",
        r"\bproduction networks?\b",
    ],
    "Innovation / Productivity": [
        r"\binnovation\b",
        r"\bproductivity\b",
        r"\btechnology\b",
        r"\bindustrial policy\b",
    ],
    "Education": [
        r"\beducation(?:al)?\b",
        r"\bschooling\b",
        r"\belite jobs\b",
    ],
    "Health": [
        r"\bhealth\b",
        r"\bmortality\b",
        r"\bmedical\b",
        r"\bpublic health\b",
    ],
    "Finance": [
        r"\bfinance\b",
        r"\bfinancial\b",
        r"\bcredit frictions?\b",
        r"\bbanking\b",
    ],
    "Mathematics": [
        r"\bmathematics?\b",
        r"\balgebraic topology\b",
        r"\bspectral sequence\b",
        r"\bcohomology\b",
        r"\boperad\b",
    ],
}


@dataclass
class PageData:
    requested_url: str
    final_url: str
    title: str
    description: str
    text: str
    line_text: str
    headings: list[str]
    links: list[tuple[str, str]]
    ok: bool


def slugify(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "expert"


def normalize_spaces(value: str) -> str:
    return " ".join(unescape(value or "").split())


def parse_js_assignment(path: Path, variable_name: str) -> dict:
    text = path.read_text()
    text = re.sub(rf"^\s*window\.{re.escape(variable_name)}\s*=\s*", "", text)
    text = text.rstrip(" ;\n")
    return json.loads(text)


def load_source_items() -> list[dict]:
    source = parse_js_assignment(SOURCE_PATH, "BOOKMARK_LIBRARY")
    for group in source.get("groups", []):
        if group.get("title") != "Research" or group.get("profile") != "Default":
            continue
        for section in group.get("sections", []):
            if section.get("title") == "Reading Material / Personal Site các chuyên gia":
                return section.get("items", [])
    raise RuntimeError("Could not find the Dia expert list in bookmarks-data.js")


def load_overrides() -> dict:
    if not OVERRIDES_PATH.exists():
        return {"entries": {}}
    return json.loads(OVERRIDES_PATH.read_text())


def request_url(session: requests.Session, url: str) -> requests.Response:
    try:
        response = session.get(url, headers=HEADERS, timeout=TIMEOUT)
        response.raise_for_status()
        return response
    except SSLError:
        response = session.get(url, headers=HEADERS, timeout=TIMEOUT, verify=False)
        response.raise_for_status()
        return response


def fetch_page(url: str, session: requests.Session) -> PageData:
    try:
        response = request_url(session, url)
        soup = BeautifulSoup(response.text, "lxml")
        title = normalize_spaces(soup.title.get_text(" ", strip=True) if soup.title else "")
        meta = soup.find("meta", attrs={"name": "description"}) or soup.find(
            "meta", attrs={"property": "og:description"}
        )
        description = normalize_spaces(meta.get("content", "") if meta else "")
        line_text = "\n".join(
            normalize_spaces(line)
            for line in soup.get_text("\n").splitlines()
            if normalize_spaces(line)
        )
        text = normalize_spaces(line_text)
        headings = []
        for heading in soup.select("h1, h2, h3"):
            cleaned = normalize_spaces(heading.get_text(" ", strip=True))
            if cleaned and cleaned not in headings:
                headings.append(cleaned)
            if len(headings) == 12:
                break
        links = []
        for anchor in soup.select("a[href]"):
            label = normalize_spaces(anchor.get_text(" ", strip=True))
            href = normalize_spaces(anchor.get("href", ""))
            if href:
                links.append((label, urljoin(response.url, href)))
        return PageData(
            requested_url=url,
            final_url=response.url,
            title=title,
            description=description,
            text=text,
            line_text=line_text,
            headings=headings,
            links=links,
            ok=True,
        )
    except Exception:
        return PageData(
            requested_url=url,
            final_url=url,
            title="",
            description="",
            text="",
            line_text="",
            headings=[],
            links=[],
            ok=False,
        )


def looks_broken(page: PageData) -> bool:
    if not page.ok:
        return True
    haystack = f"{page.final_url} {page.title} {page.description} {page.text[:400]}".lower()
    return any(hint in haystack for hint in BROKEN_HINTS)


def guess_home_url(url: str) -> str:
    parsed = urlparse(url)
    host = parsed.netloc.lower()
    parts = [part for part in parsed.path.split("/") if part]

    if "sites.google.com" in host:
        if len(parts) >= 2 and parts[0] == "site":
            return f"{parsed.scheme}://{parsed.netloc}/site/{parts[1]}/"
        if len(parts) >= 3 and parts[0] == "view":
            return f"{parsed.scheme}://{parsed.netloc}/view/{parts[1]}/{parts[2]}"

    if parsed.path and parsed.path != "/":
        return f"{parsed.scheme}://{parsed.netloc}/"

    return url


def choose_research_url(source_url: str, home_page: PageData, current_page: PageData) -> str:
    lower_source = source_url.lower()
    if current_page.ok and not looks_broken(current_page) and any(
        hint in lower_source for hint in RESEARCH_HINTS
    ):
        return current_page.final_url

    best_url = ""
    best_score = -1
    for label, href in home_page.links:
        lower_label = label.lower()
        lower_href = href.lower()
        score = 0
        if any(hint in lower_label for hint in RESEARCH_HINTS):
            score += 4
        if any(hint in lower_href for hint in RESEARCH_HINTS):
            score += 3
        if href.lower().endswith(".pdf"):
            score -= 4
        if "google.com/v3/signin" in lower_href or "drive.google.com" in lower_href:
            score -= 5
        if score > best_score:
            best_score = score
            best_url = href

    if best_score > 0:
        return best_url
    if current_page.ok and not looks_broken(current_page):
        return current_page.final_url
    return home_page.final_url


def candidate_name_segments(value: str) -> list[str]:
    parts = re.split(r"\s+[|—-]\s+|\s+\|\s+", value)
    cleaned_parts = []
    for part in parts:
        cleaned = normalize_spaces(part)
        if cleaned:
            cleaned_parts.append(cleaned)
    return cleaned_parts or [normalize_spaces(value)]


def tidy_name(value: str) -> str:
    value = normalize_spaces(value)
    value = re.sub(r"^(trang chủ của|nghiên cứu của|công trình của)\s+", "", value, flags=re.IGNORECASE)
    value = re.sub(r"\b(personal website|research and publications|using llms guides)\b", "", value, flags=re.IGNORECASE)
    value = re.sub(r"\b(home|research)\b", "", value, flags=re.IGNORECASE)
    value = normalize_spaces(value.strip(" -|"))
    if value.isupper() and len(value.split()) <= 4:
        value = value.title()
    return value


def score_name_candidate(value: str) -> int:
    lower = value.lower()
    if not value or lower in GENERIC_NAME_PHRASES:
        return -100
    if any(token in lower for token in ("assistant professor", "department", "university", "economics")):
        return -20
    score = 0
    words = value.split()
    if 1 <= len(words) <= 5:
        score += 5
    if sum(ch.isalpha() for ch in value) >= 6:
        score += 3
    if re.fullmatch(r"[A-Za-zÀ-ỹ'.\- ]+", value):
        score += 4
    if re.search(r"[A-Z][a-z]+", value):
        score += 3
    return score


def extract_display_name(bookmark_name: str, pages: list[PageData]) -> str:
    candidates = []
    for page in pages:
        candidates.extend(page.headings[:3])
        candidates.append(page.title)
    candidates.append(bookmark_name)

    best_name = tidy_name(bookmark_name)
    best_score = score_name_candidate(best_name)
    for candidate in candidates:
        for segment in candidate_name_segments(candidate):
            cleaned = tidy_name(segment)
            score = score_name_candidate(cleaned)
            if score > best_score:
                best_name = cleaned
                best_score = score

    return best_name or bookmark_name


def score_affiliation(candidate: str) -> int:
    lower = candidate.lower()
    if any(token in lower for token in ("skip to", "google sites", "search this site", "more home")):
        return -100

    score = 0
    if any(token in lower for token in ("professor", "lecturer", "researcher", "fellow", "phd student")):
        score += 5
    if "economics" in lower:
        score += 4
    if any(token in lower for token in ("department", "faculty", "school", "institute", "centre", "center")):
        score += 3
    if any(token in lower for token in ("university", "college", "lse", "mit", "harvard", "princeton", "brown")):
        score += 2
    if len(candidate) > 220:
        score -= 4
    return score


def build_affiliation_candidates(page: PageData) -> list[str]:
    candidates = []
    if page.description:
        candidates.append(page.description)

    lines = [normalize_spaces(line) for line in page.line_text.splitlines() if normalize_spaces(line)]
    for index, line in enumerate(lines[:80]):
        lower = line.lower()
        if any(
            token in lower
            for token in ("professor", "lecturer", "researcher", "fellow", "phd student", "department", "faculty")
        ):
            candidates.append(line)
            candidates.append(" ".join(lines[index : index + 3]))

    return [normalize_spaces(candidate) for candidate in candidates if normalize_spaces(candidate)]


def extract_affiliation(pages: list[PageData]) -> str:
    best = ""
    best_score = -100
    for page in pages:
        for candidate in build_affiliation_candidates(page):
            score = score_affiliation(candidate)
            if score > best_score:
                best = candidate
                best_score = score
    return tidy_affiliation(best)


def tidy_department(value: str) -> str:
    value = normalize_spaces(value.strip(" ,.;"))
    value = re.split(
        r"\b(Co-Director|Research Programme|Research Theme|Office:|CV|Hello!|Welcome!|Editorial Board Member)\b",
        value,
        maxsplit=1,
        flags=re.IGNORECASE,
    )[0]
    value = value.replace("Department of Economics at", "Department of Economics,")
    value = value.replace("Department of Economics,", "Department of Economics, ")
    value = value.replace("  ", " ")
    return value.strip(" ,")


def tidy_affiliation(value: str) -> str:
    value = normalize_spaces(value.strip(" ,.;"))
    value = re.split(
        r"\b(Office:|CV|Hello!|Welcome!|Editorial Board Member)\b",
        value,
        maxsplit=1,
        flags=re.IGNORECASE,
    )[0]
    return value.strip(" ,")


def extract_department(affiliation: str, pages: list[PageData]) -> str:
    department_patterns = [
        re.compile(r"(Department of [A-Z][^.;\n]{0,120})"),
        re.compile(r"(Faculty of [A-Z][^.;\n]{0,120})"),
        re.compile(r"(School of [A-Z][^.;\n]{0,120})"),
        re.compile(r"(Institute of [A-Z][^.;\n]{0,120})"),
        re.compile(r"(National School of [A-Z][^.;\n]{0,120})"),
        re.compile(r"(IIES Stockholm University)"),
    ]

    for page in pages:
        for text in (page.description, page.line_text):
            for pattern in department_patterns:
                match = pattern.search(text)
                if match:
                    return tidy_department(match.group(1))

    economics_match = re.search(
        r"(Assistant|Associate|Full|Distinguished|Sir [A-Z][a-z]+)? ?Professor of Economics(?: at|,)\s+([^.;\n]{3,120})",
        affiliation,
        re.IGNORECASE,
    )
    if economics_match:
        return tidy_department(f"Economics, {economics_match.group(2)}")

    return tidy_department(affiliation)


def sentence_candidates(text: str) -> list[str]:
    return [
        normalize_spaces(part)
        for part in re.split(r"(?<=[.!?])\s+", text.replace("•", ". "))
        if normalize_spaces(part)
    ]


def extract_summary(pages: list[PageData]) -> str:
    preferred_tokens = (
        "research focuses",
        "research interests",
        "i study",
        "i work on",
        "my work",
        "my research",
        "i am a",
    )

    for page in pages:
        for candidate in [page.description] + sentence_candidates(page.text[:2400]):
            if not candidate:
                continue
            lower = candidate.lower()
            if len(candidate) < 60 or len(candidate) > 240:
                continue
            if any(token in lower for token in preferred_tokens):
                return candidate
    return ""


def extract_fields(pages: list[PageData], summary: str, paper_titles: list[str]) -> list[str]:
    text_blob = " ".join(
        filter(
            None,
            [
                summary,
                " ".join(paper_titles),
                *(page.description for page in pages),
                *(page.text[:1800] for page in pages),
            ],
        )
    ).lower()

    scored_fields = []
    for field, patterns in FIELD_RULES.items():
        score = 0
        for pattern in patterns:
            score += len(re.findall(pattern, text_blob, flags=re.IGNORECASE))
        if score:
            scored_fields.append((score, field))

    scored_fields.sort(key=lambda item: (-item[0], item[1]))
    return [field for _, field in scored_fields[:4]]


def clean_paper_title(value: str) -> str:
    value = normalize_spaces(value)
    value = value.strip(" \"'“”[]")
    value = re.sub(r"\s+\((with|joint with).*$", "", value, flags=re.IGNORECASE)
    value = re.sub(r"\s+\[[^\]]+\]$", "", value)
    value = re.sub(r"\s{2,}", " ", value)
    return value.strip(" -.;,:")


def is_paper_title(title: str) -> bool:
    lower = title.lower()
    if lower in PAPER_STOP_TITLES:
        return False
    if any(pattern.search(title) for pattern in PAPER_STOP_PATTERNS):
        return False
    if len(title) < 18 or len(title) > 180:
        return False
    if sum(char.isalpha() for char in title) < 12:
        return False
    if "http" in lower or "@" in title:
        return False
    words = title.split()
    if len(words) < 3 and ":" not in title and "?" not in title:
        return False
    if len(words) <= 4 and all(word[:1].isupper() for word in words if word[:1].isalpha()):
        if ":" not in title and "?" not in title and sum(
            word.lower() in {"of", "the", "and", "in", "to", "for", "with"} for word in words
        ) == 0:
            return False
    return True


def add_paper_candidate(
    bucket: list[tuple[str, str, int]],
    title: str,
    url: str,
    score: int,
) -> None:
    cleaned = clean_paper_title(title)
    if is_paper_title(cleaned):
        bucket.append((cleaned, url, score))


def extract_papers(primary_page: PageData, home_page: PageData) -> list[dict]:
    pages = []
    for page in (primary_page, home_page):
        if page.final_url not in {existing.final_url for existing in pages} and page.ok and not looks_broken(page):
            pages.append(page)

    candidates: list[tuple[str, str, int]] = []
    quote_pattern = re.compile(r"[“\"]([^\"\n]{18,180})[”\"]")

    for page in pages:
        for match in quote_pattern.findall(page.line_text):
            add_paper_candidate(candidates, match, page.final_url, 5)

        for label, href in page.links:
            score = 0
            lower_href = href.lower()
            if lower_href.endswith(".pdf"):
                score += 3
            if any(host in lower_href for host in ("aeaweb.org", "nber.org", "doi.org", "journals.", "academic.oup")):
                score += 2
            if any(hint in lower_href for hint in ("paper", "publication", "research", "working")):
                score += 1
            add_paper_candidate(candidates, label, href, score)

    seen = set()
    selected = []
    for title, url, score in sorted(candidates, key=lambda item: (-item[2], len(item[0]), item[0].lower())):
        key = re.sub(r"[^a-z0-9]+", "", title.lower())
        if key in seen:
            continue
        seen.add(key)
        selected.append({"title": title, "url": url})
        if len(selected) == 4:
            break

    return selected


def merge_sources(*values: str) -> list[str]:
    seen = set()
    merged = []
    for value in values:
        if value and value not in seen:
            merged.append(value)
            seen.add(value)
    return merged


def apply_override(expert: dict, override: dict) -> dict:
    mapping = {
        "canonicalName": "name",
        "officialSite": "officialSite",
        "affiliation": "affiliation",
        "department": "department",
        "summary": "summary",
        "fields": "fields",
        "papers": "papers",
        "sourcePages": "sourcePages",
        "status": "status",
    }
    for source_key, target_key in mapping.items():
        if source_key in override and override[source_key]:
            expert[target_key] = override[source_key]
    expert["id"] = slugify(expert["name"])
    return expert


def build_expert(item: dict, override: dict, session: requests.Session) -> dict:
    source_url = override.get("officialSite", item["url"])
    current_page = fetch_page(source_url, session)

    home_url = guess_home_url(source_url)
    home_page = current_page
    if home_url != current_page.final_url:
        guessed_home = fetch_page(home_url, session)
        if guessed_home.ok and not looks_broken(guessed_home):
            home_page = guessed_home

    if looks_broken(home_page) and current_page.ok and not looks_broken(current_page):
        home_page = current_page

    research_url = choose_research_url(source_url, home_page, current_page)
    research_page = current_page
    if research_url and research_url != current_page.final_url:
        candidate_page = fetch_page(research_url, session)
        if candidate_page.ok and not looks_broken(candidate_page):
            research_page = candidate_page

    pages = [home_page, research_page, current_page]
    name = extract_display_name(item["name"], pages)
    affiliation = extract_affiliation(pages)
    department = extract_department(affiliation, pages)
    summary = extract_summary(pages)
    papers = extract_papers(research_page, home_page)
    fields = extract_fields([home_page, research_page], summary, [paper["title"] for paper in papers])

    expert = {
        "id": slugify(name),
        "name": name,
        "sourceLabel": item["name"],
        "officialSite": home_page.final_url if home_page.ok else source_url,
        "affiliation": affiliation,
        "department": department,
        "summary": summary,
        "fields": fields,
        "papers": papers,
        "sourcePages": merge_sources(item["url"], home_page.final_url, research_page.final_url),
        "status": "ok",
    }

    if not expert["department"] or not expert["fields"]:
        expert["status"] = "partial"
    if not any(page.ok and not looks_broken(page) for page in pages):
        expert["status"] = "source-needs-review"

    expert = apply_override(expert, override)
    if not expert.get("affiliation"):
        expert["affiliation"] = expert.get("department", "")
    if not expert.get("officialSite"):
        expert["officialSite"] = source_url
    if not expert.get("status"):
        expert["status"] = "ok"
    return expert


def write_output(experts: Iterable[dict]) -> None:
    experts = sorted(experts, key=lambda item: item["name"].lower())
    all_fields = sorted({field for expert in experts for field in expert.get("fields", [])})
    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": "Official researcher pages linked from the Dia expert folder",
        "count": len(experts),
        "fields": all_fields,
        "experts": experts,
    }
    OUTPUT_PATH.write_text(
        "window.EXPERT_DIRECTORY = " + json.dumps(payload, ensure_ascii=False, indent=4) + ";\n"
    )


def main() -> None:
    overrides = load_overrides().get("entries", {})
    experts = []
    with requests.Session() as session:
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            futures = {}
            for item in load_source_items():
                override = overrides.get(item["name"], {})
                futures[executor.submit(build_expert, item, override, session)] = item["name"]

            for future in as_completed(futures):
                label = futures[future]
                try:
                    expert = future.result()
                    experts.append(expert)
                    print(f"[ok] {label}", file=sys.stderr)
                except Exception as exc:
                    print(f"[fail] {label}: {exc}", file=sys.stderr)
                    fallback_name = overrides.get(label, {}).get("canonicalName", label)
                    experts.append(
                        {
                            "id": slugify(fallback_name),
                            "name": fallback_name,
                            "sourceLabel": label,
                            "officialSite": overrides.get(label, {}).get("officialSite", ""),
                            "affiliation": overrides.get(label, {}).get("affiliation", ""),
                            "department": overrides.get(label, {}).get("department", ""),
                            "summary": overrides.get(label, {}).get("summary", ""),
                            "fields": overrides.get(label, {}).get("fields", []),
                            "papers": overrides.get(label, {}).get("papers", []),
                            "sourcePages": overrides.get(label, {}).get("sourcePages", []),
                            "status": overrides.get(label, {}).get("status", "source-needs-review"),
                        }
                    )

    write_output(experts)


if __name__ == "__main__":
    main()
