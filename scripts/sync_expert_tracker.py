#!/usr/bin/env python3
from __future__ import annotations

import subprocess
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent


def run(script_name: str) -> None:
    subprocess.run(
        [sys.executable, str(REPO_ROOT / "scripts" / script_name)],
        check=True,
        cwd=REPO_ROOT,
    )


def main() -> None:
    run("export_dia_bookmarks.py")
    run("build_expert_tracker.py")
    print("Synced expert tracker from Dia bookmarks.")


if __name__ == "__main__":
    main()
