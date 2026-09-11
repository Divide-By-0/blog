#!/usr/bin/env python3
"""Build real Markdown fixtures with Hugo and check spoiler rendering.

Run: python3 tests/check_spoilers.py [path-to-hugo]
"""
from pathlib import Path
import re
import subprocess
import sys
import tempfile

root = Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix="blog-spoiler-test-") as destination:
    subprocess.run([
        sys.argv[1] if len(sys.argv) > 1 else "hugo",
        "--contentDir", "tests/fixtures/spoilers",
        "--destination", destination, "--minify",
    ], cwd=root, check=True)
    html = (Path(destination) / "spoiler-syntax-check/index.html").read_text()
    content = html.split("<section>", 1)[1].split("</section>", 1)[0]
    bodies = re.findall(r'<(?:span|div) class="?spoiler-body"?>(.*?)</(?:span|div)>', content, re.S)
    assert len(bodies) == 7, bodies
    assert bodies[:2] == ["secret", "spaced secret"], bodies
    assert '<strong>bold secret</strong>' in bodies[2], bodies[2]
    assert re.search(r'<a href="?https://example.com/"?>a link</a>', bodies[2]), bodies[2]
    assert bodies[3:] == ["one", "two", "old secret", "Old block secret."], bodies
    assert '<code>||literal code||</code>' in content
    assert '<code>||literal fence||\n</code>' in content
    assert 'Escaped: ||literal escaped||.' in content
    assert 'Unmatched: ||unfinished.' in content
    assert '</span></span>.' in content, "No added space before punctuation"
    assert len(re.findall(r'aria-expanded="?false', content)) == 7
    print("PASS: plain/spaced, Markdown links, adjacent, code, escaped, unmatched, and legacy spoilers")
