export default class SelectText {
  constructor(container) {
    this.selection = []
    this.container = container
    this.words = container.textContent.trim().split(/([\W]+)/)
    this.render()
  }

  renderSpan(text, index) {
    return `<span
      index=${index}
      ${this.selection.length && this.selection[0] <= index && index < this.selection[1] ? `selected` : ''}
      >${text}</span>`
  }

  addSelection(index, length) {
    if(index == this.selection[0]) return this.selectionChanged([])
    // Select next words
    const selection = [this.selection[0]]
    if(!this.selection.length || index <= this.selection[0]) selection[0] = index
    selection[1] = index + length - 1
    this.selectionChanged(selection)
  }

  selectionChanged(selection) {
    this.selection = selection
    this.onSelect && this.onSelect(selection)
    this.render()
  }

  render() {
    let index = 0
    this.container.innerHTML = this.words.map(w => {
      const span = this.renderSpan(w, index)
      index += w.length
      return span
    }).join('')

    Array.from(this.container.querySelectorAll('span')).filter(span => span.textContent.trim()).forEach(span => {
      span.addEventListener('click', (event) => {
        const span = event.target
        this.addSelection(Number(span.getAttribute('index')), span.textContent.length)
      })
    })
  }
}
