// only when selected, not in table

function showImage(srcInput,targetImage) {
    var fr = new FileReader();

    // when image is loaded, set the src of the image where you want to display it
    fr.onload = function(e) { 
        const base64Image = e.target.result;
        targetImage.src = base64Image;

        // Optional JS styling
        targetImage.style.width = "200px";
        targetImage.style.height = "auto";

        localStorage.setItem("tempImage", base64Image);
    };

    srcInput.addEventListener("change", function() {
        // fill fr with image data    
        if (srcInput.files.length > 0) {
            fr.readAsDataURL(srcInput.files[0]);
        }
    });
}

var src = document.getElementById("src");
var target = document.getElementById("target");
showImage(src,target);

