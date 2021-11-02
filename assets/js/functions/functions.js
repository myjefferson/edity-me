var edit_desk = $(".edit-desk")
var id = 0;
var id_selecionado;
var src_img_selecionada;

//Mask input
$(document).ready(function(){
    $('.controls .value-tam').mask('000');
})

//Message before refresh
window.onbeforeunload = function(){
    return "Tem certeza que deseja sair? Todas as edições não serão perdidas se você sair."
}

//Desativa o arraste/save do site nas imagens
window.ondragstart = function() { 
    return false; 
}

//Add imagens
var area_camadas = $(".camadas")
function addImage(input){
    if(input.files && input.files[0]){
        var reader = new FileReader()
        reader.onload = function (e){
            $(edit_desk).append(`
                <img 
                    id="${id}"
                    src="${e.target.result}"    
                    style="
                        height: 400px; 
                        width: auto; 
                        z-index: 1;
                        left: 50%;
                        top: 50%;
                        translate: -50% -50%;
                        -webkit-translate: -50% -50%;
                    "
                    onmousedown="moveImage('${id}')"
                    draggable="false"
                    crossOrigin="anonymous"
                    alt="Opa! Ocorreu um erro no arquivo."
                >
            `)

            $(area_camadas).prepend(`
                <div class="camada_item" id="camada_${id}" onclick="selectedImage(${id})">
                    <img 
                        src="${e.target.result}"
                        alt="Erro na imagem"
                    >
                    <button class="btn_deleta_camada" onclick="deleteImage(${id})" title="Apagar Camada">
                        <span class="iconify" data-icon="ic:sharp-delete-forever"></span>
                    </button>
                    <section>
                        <button onclick="paraCima(${id})" class="btn_para_cima" title="Trazer para cima"><span class="iconify" data-icon="ant-design:caret-up-outlined"></span></button>
                        <button onclick="paraBaixo(${id})" class="btn_para_baixo" title="Trazer para baixo"><span class="iconify" data-icon="ant-design:caret-down-filled"></span></button>
                    </section>
                </div>
            `)
        }

        reader.readAsDataURL(input.files[0]); //Situação que precisa de ponto e virgula     
        
    }else{
        //se imagem inválida
        var img = input.value;
        $(input).next().attr('src', img)
    }
    
    id++;
}

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

function paraCima(id){
    var camada = $(`.camadas #camada_${id}`); // copia o conteudo da camada atual
    var cam_de_cima = $(`.camadas #camada_${id}`).prev(); //copia a camada anterior
    camada.after(cam_de_cima); // insere a camada em cima da outra

    //Imagem se inverte - vai para baixo
    var img = $(`.edit-desk img#${id}`); // copia o conteudo da última
    var img_de_cima = $(`.edit-desk img#${id}`).next(); //copia a camada de baixo
    img.before(img_de_cima) //insere na frente
}

function paraBaixo(id){
    //Camada vai para baixo
    var camada = $(`.camadas #camada_${id}`); // copia o conteudo da camada atual
    var cam_de_cima = $(`.camadas #camada_${id}`).next(); //copia a camada posterior
    camada.before(cam_de_cima); // insere a camada em cima da outra

    //Imagem se inverte - vai para baixo
    var img = $(`.edit-desk img#${id}`); // copia o conteudo da última
    var img_de_cima = $(`.edit-desk img#${id}`).prev(); //copia a camada de baixo
    img.after(img_de_cima) //insere na frente
}


//Imagem Selecionada e Desselecionada
var tamImagem = $(".controls .value-tam");
tamImagem.prop("disabled", true);

function selectedImage(id){
    var img = $(`.edit-desk img#${id}`);
    id_selecionado = id;
    src_img_selecionada = img.attr("src")
    
    //Desselecionar/reseta a seleção tirando a borda vermelha
    desSelect()

    //Refresh do botão de cortar imagem
    $(".btn_recorte_imagem").html(`<button onclick="cortarImagem()" type="button" class="btn btn-primary btn_cortar" data-toggle="modal" data-target="#modalCropCenter"><span class="iconify" data-icon="mdi:crop"></span> Cortar Imagem</button>`)

    //campo/imput do tamanho da imagem
    tamImagem.val(img.height())
    $(`.btn-reduzir`).prop("disabled", false)
    $(`.btn-aumentar`).prop("disabled", false)

    //append no modal de recorte
    $(".modal .janela-area-de-recorte").html(`<img src="${src_img_selecionada}" class="imagem-recorte">`)
    	
    $(`#camada_${id}`).css({"border": "1px solid #1DFFF1"})
    img.css({"border": "1px solid #1DFFF1"})
}

function desSelect(){
    $(`.btn-reduzir`).prop("disabled", true)
    $(`.btn-aumentar`).prop("disabled", true)
    
    $(".edit-desk img").css({"border": "none"})
    $(`.camada_item`).css({"border": "none"})
    $(".btn_recorte_imagem").html('<button class="btn_cortar" disabled title="Selecione a imagem para cortar"><span class="iconify" data-icon="mdi:crop"></span> Cortar Imagem</button>')
    //campo/imput do tamanho da imagem
    tamImagem.val("")
}

/*Aumentar imagem*/
function aumentarImagem(id){
    var img = $(`.edit-desk img#${id}`);
    tamImagem.prop("disabled", true)

    //Atualiza o input
    tamImagem.val(img.height())

    img.css({
        "height": `${img.height() + 5}px`
    })
}

function reduzirImagem(id){
    var img = $(`.edit-desk img#${id}`);
    tamImagem.prop("disabled", true)

    //Atualiza o input
    tamImagem.val(img.height())

    img.css({
        "height": `${img.height() - 5}px`
    })
}

/*Apagar Imagem*/
function deleteImage(id){
    $(`.edit-desk img#${id}`).remove()
    $(`#camada_${id}`).remove()
    desSelect()
}

//Cortar a imagem
let img_result = document.querySelector('.img-result'),
result = document.querySelector('.modal .janela-area-de-recorte'),
cropper = '';

function cortarImagem(){
    //Abre o modal
    $('.modal').modal('show')

    // create new image
    let img = document.createElement('img');
    img.id = 'image';
    //src do item selecionado
    img.src = src_img_selecionada 
    // limpa os resultados
    result.innerHTML = '';
    //append de nova imagem
    result.appendChild(img);
    //Aplica as definições
    cropper = new Cropper(img, {
        minContainerWidth: 500,
        minContainerHeight: 500
    });
}

//Salva o recorte
function salvarCorte(id){
    let cropped = document.getElementById(`${id}`)
    // define a proporção do corte da imagem
    let imgSrc = cropper.getCroppedCanvas({
        width: 300 // input value
    }).toDataURL();
    cropped.src = imgSrc;
    
    //Fecha o modal
    $('.modal').modal('hide')
}

//Salvar/Baixar imagem
function salvarImagem(){
    //Oculta os botões
    $(".btn-add-image").hide()
    $(".btn-salvar-image").hide()
    
    //Desseleciona os itens
    desSelect()

    html2canvas($("#edit-desk")[0]).then(function(canvas) {
        $(".pagina-principal").append("<a class='download_image' download='minha_capa.jpg' href="+canvas.toDataURL()+">Baixar</a>")
        $(".download_image")[0].click()
        $(".download_image").remove();
    });

    //Seleciona a imagem novamente
    selectedImage(id)

    //Mostra os botões
    $(".btn-add-image").show()
    $(".btn-salvar-image").show()
}