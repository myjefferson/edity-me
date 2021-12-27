//Move image
function moveImage(id){
    var mousePosition;
    var offset = [0,0];
    var img;
    var isDown = false;

    var img = document.getElementById(`${id}`);
    selectedImage(id)
    
    img.addEventListener('mousedown', function(e) { //Posição atual do mouse no clique
        isDown = true;
        offset = [
            img.offsetLeft - e.clientX,
            img.offsetTop - e.clientY
        ];
        $(`#${id}`).css({"cursor": "grabbing"})
    });

    document.addEventListener('mousemove', function(event) { //Nova posição do mouse ao mover
        if (isDown) {
            mousePosition = {
                x : event.clientX,
                y : event.clientY
            };
            img.style.left = (mousePosition.x + offset[0]) + 'px';
            img.style.top  = (mousePosition.y + offset[1]) + 'px';
            $(`#${id}`).css({"cursor": "grabbing"})
        }
    });

    document.addEventListener('mouseup', function() { //Desabilita o move
        isDown = false;
        $(`#${id}`).css({"cursor": "grab"})
    });
}