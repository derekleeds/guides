{{ with .Title }}# {{ . }}{{ end }}
{{ with .Params.description }}
*{{ . }}*{{ end }}
{{ with .Content }}
{{ . }}
{{ end }}

{{ with .Pages }}
## Pages in this Section
{{ range . }}
- [{{ .Title }}]({{ .Permalink }})
  {{ with .Params.description }}{{ . }}{{ else }}{{ .Summary }}{{ end }}
{{ end }}
{{ end }}

---
*Source: [{{ .Site.Title }}]({{ .Site.BaseURL }})*