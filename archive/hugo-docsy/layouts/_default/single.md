{{ with .Title }}# {{ . }}{{ end }}
{{ with .Date }}*{{ .Format "January 2, 2006" }}*{{ end }}
{{ with .Params.author }}
*Author: {{ . }}*{{ end }}
{{ with .Params.description }}
*Description: {{ . }}*{{ end }}

{{ .RawContent }}
{{ with .Params.links }}

## Resources
{{ range . }}
- [{{ .name }}]({{ .url }}): {{ .desc }}
{{ end }}
{{ end }}

---
*Source: [{{ .Site.Title }}]({{ .Site.BaseURL }})*
