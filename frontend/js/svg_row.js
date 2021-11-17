
class SVGRow {
  constructor(x, y, entry) {
    this.x = x;
    this.y = y;
    this.entry = entry;
  }

  draw($commitTableSVG, prev) {
    const self = this;
    const svgCircle = self.makeSVG('circle', {'cx': self.x, 'cy': self.y, 'r': 10, 'stroke': 'blue', 'stroke-width': 1, 'fill': 'blue'});
    $commitTableSVG.append(svgCircle);
    if (prev !== null) {
      const svgLine = self.makeSVG('line', {x1: prev.x, y1: prev.y, x2: self.x, y2: self.y, style: 'stroke:rgb(0,0,255);stroke-width:4'});
      $commitTableSVG.append(svgLine);
    }
    let currentX = self.x + 15;
    self.entry[0].forEach(function(branch) {
      const branchText = '(' + branch + ') ';
      const svgTextElem = self.makeSVG('text', {x: currentX, y: self.y + 6, fill: 'rgb(100, 100, 255)'});
      svgTextElem.textContent = branchText;
      $commitTableSVG.append(svgTextElem);
      currentX += svgTextElem.getBBox().width + 5;
    });

    const entryElem = self.makeSVG('text', {x: currentX, y: self.y + 6, fill: 'white'});
    entryElem.textContent = self.entry[1];
    $commitTableSVG.append(entryElem);
  }

  makeSVG(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k in attrs) {
      el.setAttribute(k, attrs[k]);
    }
    return el;
  }
}
