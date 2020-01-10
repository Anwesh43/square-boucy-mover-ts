const {writeFileSync} = require('fs')
const html = '<body>\n\t<script src = "index.js">\n\t</script>\n\t<script>\n\t\tStage.init()\n\t</script>\n</body>'
writeFileSync('index.html', Buffer.from(html))
