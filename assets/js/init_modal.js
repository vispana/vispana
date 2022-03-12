export const InitModal = {
  mounted() {
    const handleOpenCloseEvent = event => {
      if (event.detail.open === false) {
        this.el.removeEventListener("modal-change", handleOpenCloseEvent)

        setTimeout(() => {
          // This timeout gives time for the animation to complete
          this.pushEventTo(event.detail.id, "close", {})
        }, 300);
      }
    }

    // This listens to modal event from AlpineJs
    this.el.addEventListener("modal-change", handleOpenCloseEvent)

    // This is the close event that comes from the LiveView
    this.handleEvent('close', data => {
      if (!document.getElementById(data.id)) return

      const event = new CustomEvent('close-now')
      this.el.dispatchEvent(event)
    })
  }
}
