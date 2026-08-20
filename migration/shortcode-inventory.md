# Hugo shortcode inventory

The archived Hugo content contains 34 shortcode calls:

| Shortcode                                  | Count | Migration treatment                                       |
| ------------------------------------------ | ----: | --------------------------------------------------------- |
| `ref`                                      |    22 | Replaced with explicit site-relative Markdown links       |
| `blocks/cover` opening and closing calls   |     4 | Replaced by the Starlight splash hero or ordinary content |
| `blocks/section` opening and closing calls |     6 | Replaced by headings, prose, and Starlight cards          |
| `blocks/lead` opening and closing calls    |     2 | Replaced by ordinary introductory prose                   |

Validation on 2026-08-19 found no `{{< ... >}}` or `{{% ... %}}` shortcode syntax in active content under `src/`.
