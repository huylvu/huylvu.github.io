#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from collections import OrderedDict
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import parse_qs, urlparse


REPO_ROOT = Path(__file__).resolve().parent.parent
DIA_USER_DATA = Path.home() / "Library/Application Support/Dia/User Data"
PUBLIC_OUTPUT = REPO_ROOT / "other/research-experts/bookmarks-data.js"
PRIVATE_OUTPUT = REPO_ROOT / "other/research-experts/bookmarks-private.js"

PRIVATE_DOMAINS = {
    "app.researchrabbit.ai",
    "app.sesame.com",
    "chatgpt.com",
    "claude.ai",
    "copilot.microsoft.com",
    "docs.google.com",
    "drive.google.com",
    "gemini.google.com",
    "mail.google.com",
    "mitxonline.mit.edu",
    "notebooklm.google.com",
    "storm.genie.stanford.edu",
}

PRIVATE_QUERY_KEYS = {
    "access_token",
    "auth",
    "code",
    "pli",
    "state",
    "token",
    "usp",
}

PRIVATE_PATTERNS = [
    re.compile(pattern)
    for pattern in (
        r"/chat/",
        r"/drive/",
        r"/document/d/",
        r"/folders/",
        r"/forms/d/",
        r"/mail/u/",
        r"/notebook/",
        r"/presentation/d/",
        r"/spreadsheets/d/",
        r"/edit(?:$|\\?)",
        r"#gid=",
        r"#inbox",
    )
]


def slugify(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "bookmark"


def discover_profiles() -> list[tuple[str, Path]]:
    profiles = []
    for bookmark_file in sorted(DIA_USER_DATA.glob("*/Bookmarks")):
        profiles.append((bookmark_file.parent.name, bookmark_file))
    return profiles


def is_private_url(url: str) -> bool:
    parsed = urlparse(url)
    host = parsed.netloc.lower()
    if host.startswith("www."):
        host = host[4:]

    if host in PRIVATE_DOMAINS:
        return True

    if host == "overleaf.com" and parsed.path.startswith("/project"):
        return True

    if host == "replit.com" and parsed.path.startswith("/~"):
        return True

    if host == "shinyapps.io" and parsed.path.startswith("/admin"):
        return True

    if set(parse_qs(parsed.query).keys()) & PRIVATE_QUERY_KEYS:
        return True

    path_blob = parsed.path or ""
    if parsed.query:
        path_blob += "?" + parsed.query
    if parsed.fragment:
        path_blob += "#" + parsed.fragment

    return any(pattern.search(path_blob) for pattern in PRIVATE_PATTERNS)


def make_item(node: dict, visibility: str, section_path: str, profile: str) -> dict:
    return {
        "name": node.get("name") or urlparse(node["url"]).netloc or node["url"],
        "url": node["url"],
        "note": "",
        "visibility": visibility,
        "searchTerms": " ".join(filter(None, [profile, section_path])),
    }


def split_group(group_node: dict, profile: str) -> tuple[dict | None, dict | None]:
    public_sections: OrderedDict[str, dict] = OrderedDict()
    private_sections: OrderedDict[str, dict] = OrderedDict()

    def recurse(trail: list[str], node: dict) -> None:
        safe_urls = []
        private_urls = []

        for child in node.get("children", []):
            if child.get("type") == "url":
                if is_private_url(child["url"]):
                    private_urls.append(child)
                else:
                    safe_urls.append(child)
            elif child.get("type") == "folder":
                recurse(trail + [child.get("name", "Folder")], child)

        if safe_urls:
            title = "Overview" if not trail else " / ".join(trail)
            key = slugify(title)
            public_sections.setdefault(key, {"id": key, "title": title, "items": []})
            for url_node in safe_urls:
                public_sections[key]["items"].append(make_item(url_node, "public", title, profile))

        if private_urls:
            title = "Overview" if not trail else " / ".join(trail)
            key = slugify(title)
            private_sections.setdefault(key, {"id": key, "title": title, "items": []})
            for url_node in private_urls:
                private_sections[key]["items"].append(make_item(url_node, "private", title, profile))

    recurse([], group_node)

    def build_group(sections: OrderedDict[str, dict], description_suffix: str) -> dict | None:
        if not sections:
            return None
        return {
            "id": slugify(f"{profile}-{group_node.get('name', 'group')}"),
            "title": group_node.get("name", "Untitled"),
            "profile": profile,
            "description": f"Imported from Dia bookmark bar {description_suffix}".strip(),
            "sections": list(sections.values()),
        }

    return (
        build_group(public_sections, "• public-safe"),
        build_group(private_sections, "• local-private"),
    )


def count_items(groups: list[dict]) -> int:
    return sum(len(section["items"]) for group in groups for section in group["sections"])


def build_libraries() -> tuple[dict, dict]:
    public_groups = []
    private_groups = []
    profiles = []

    for profile, bookmark_path in discover_profiles():
        profiles.append(profile)
        data = json.loads(bookmark_path.read_text())
        top_level = data.get("roots", {}).get("bookmark_bar", {}).get("children", [])
        for child in top_level:
            if child.get("type") != "folder":
                continue
            public_group, private_group = split_group(child, profile)
            if public_group:
                public_groups.append(public_group)
            if private_group:
                private_groups.append(private_group)

    stamp = datetime.now(timezone.utc).isoformat(timespec="seconds")

    public_library = {
        "groups": public_groups,
        "meta": {
            "source": "Dia",
            "visibility": "public-safe",
            "profiles": profiles,
            "generatedAt": stamp,
            "totalCount": count_items(public_groups),
        },
    }
    private_library = {
        "groups": private_groups,
        "meta": {
            "source": "Dia",
            "visibility": "local-private",
            "profiles": profiles,
            "generatedAt": stamp,
            "totalCount": count_items(private_groups),
        },
    }
    return public_library, private_library


def write_js(path: Path, variable_name: str, payload: dict) -> None:
    path.write_text(
        f"window.{variable_name} = " + json.dumps(payload, ensure_ascii=False, indent=4) + ";\n"
    )


def main() -> None:
    public_library, private_library = build_libraries()
    write_js(PUBLIC_OUTPUT, "BOOKMARK_LIBRARY", public_library)
    write_js(PRIVATE_OUTPUT, "PRIVATE_BOOKMARK_LIBRARY", private_library)
    print(
        "Exported Dia bookmarks:",
        f"public-safe={public_library['meta']['totalCount']}",
        f"local-private={private_library['meta']['totalCount']}",
    )


if __name__ == "__main__":
    main()
