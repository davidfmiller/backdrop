A [YUI 3](http://yuilibrary.com) module for smooth background image loading used on [http://readmeansrun.com](http://readmeansrun.com).

Events:

- start: invoked when a backdrop is about to be loaded
- end: invoked when a backdrop has been downloaded & applied to the page

```
var dropper = new Y.Backdrop({
  'id' : 'backdrop',
  'duration' : 0.5
});

...

dropper.on('start', function(e) {
  console.log('Backdrop loading: ' + e.details[0]); // src of backdrop image
});

dropper.on('end', function(e) {
  console.log('Backdrop applied: ' + e.details[0]); // src of backdrop image
});

... 

dropper.drop({ 'url' : '', 'styles' : { 'position' : 'left bottom', 'size' : 'cover'} });

```

Free to use, please include a link to [http://readmeansrun.com](http://readmeansrun.com) in your page's source.

