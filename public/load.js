var bar = new ProgressBar.Line(page_loading_text, {
  easing: 'easeInOut',
  duration: 1000,
  strokeWidth: 0.2,
  color: '#555',
  trailWidth: 0.2,
  trailColor: '#bbb',
  text: {       
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      padding: '0',
      margin: '-30px 0 0 0',
      transform:'translate(-50%,-50%)',
      'font-size':'1rem',
      color: '#fff',
    },
    autoStyleContainer: false 
  },
  step: function(state, bar) {
    bar.setText(Math.round(bar.value() * 100) + ' %'); 
  }
});

bar.animate(1.0, function () {
  $("#page_loading").delay(500).fadeOut(800);
});  