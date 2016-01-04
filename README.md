A JavaScript module for smooth background image loading used on [http://readmeansrun.com](http://readmeansrun.com).

Events:

- start: fired when a backdrop is about to be loaded
- end: fired when a backdrop has been downloaded & applied to the page

View more [here](https://davidfmiller.github.io/backdrop/).

Example usage:

```
var dropper = new Backdrop({
  'id' : 'backdrop',
  'duration' : 0.5
});

dropper.on('start', function(e) {
  console.log('Backdrop loading: ' + e.details[0]); // src of backdrop image
});

dropper.on('end', function(e) {
  console.log('Backdrop applied: ' + e.details[0]); // src of backdrop image
});

dropper.drop({
  'url' : 'http://davidfmiller.github.io/assets/img/backdrop/koru.jpg',
  'styles' : { 'position' : 'left bottom', 'size' : 'cover'}
});

```

Free to use, please include a link to [http://readmeansrun.com](http://readmeansrun.com) in your page's source.

