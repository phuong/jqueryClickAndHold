# jqueryClickAndHold
Capture mousedown and hold, fire event during hold event. [Demo](https://phuong.github.io/jqueryClickAndHold/)

# Usage

## Basic usage

Press button and hold, this event will fire until button is released.

```javascript
    $('button').clickAndHold(function (e, n) {
        console.log("Call me baby ", n);
    });
```

## More options
```javascript
    $('button').clickAndHold({
        timeout: 200,
        onHold: function(event, times) {
            console.log("Bam");
        },
        onRelease: function(event) {
            console.log("Reload");
        }
    });
```