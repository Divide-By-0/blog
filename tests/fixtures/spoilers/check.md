---
title: Spoiler syntax checks
slug: spoiler-syntax-check
---

Plain ||secret|| and || spaced secret ||.

Rich ||**bold secret** and [a link](https://example.com/)||.

Adjacent ||one||||two||.

Inline code: `||literal code||`.

```
||literal fence||
```

Escaped: \|\|literal escaped\|\|.

Unmatched: ||unfinished.

Legacy: {{< spoil "old secret" >}}

{{< spoiler >}}
Old block secret.
{{< /spoiler >}}
