export default class SelectText {
  constructor(container) {
    this.regex = /([0-9A-Za-zœ-ŸÀ-ʯΆ-ῼŠšŽžŒ$%€µß∂ƒ£∑®¥øπ∆ßΩ√™¢∞ﬁﬂ∏Ø‰¿Âı◊∫∮∇ℵ∴∵⋯⋮⋱|∠⌢⋄□⌊⌋⌈⌉ℤ]+)/
    this.selection = []
    this.container = container
    this.words = container.textContent.trim().split(this.regex)
    this.render()
  }

  renderSpan(text, index) {
    const classes = []
    if (this.selection.length && this.selection[0] <= index && index < this.selection[1]) classes.push('selected')
    if (this.selection[0] === index) classes.push('first')
    if (this.selection[1] === index + text.length - 1) classes.push('last')
    return `<span
      index=${index}
      class="${classes.join(' ')}"
      >${text}</span>`
  }

  addSelection(index, length) {
    if (index == this.selection[0]) return this.selectionChanged([])
    // Select next words
    const selection = [this.selection[0]]
    if (!this.selection.length || index <= this.selection[0]) selection[0] = index
    selection[1] = index + length - 1
    this.selectionChanged(selection)
  }

  selectionChanged(selection) {
    this.selection = selection
    this.render()
    this.onSelect && this.onSelect(selection)
  }

  render() {
    let index = 0
    this.container.innerHTML = this.words.map(w => {
      const span = this.renderSpan(w, index)
      index += w.length
      return span
    }).join('')

    Array.from(this.container.querySelectorAll('span')).filter(span => {
      const match = span.textContent.match(this.regex)
      return match && match.index === 0
    }).forEach(span => {
      span.addEventListener('click', (event) => {
        const span = event.target
        this.addSelection(Number(span.getAttribute('index')), span.textContent.length)
      })
    })
  }
}
