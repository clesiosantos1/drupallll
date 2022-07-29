var picker = new CP(document.querySelector('#color-pick'));
picker.on("change", function(color) {
    this.source.value = '#' + color;
});