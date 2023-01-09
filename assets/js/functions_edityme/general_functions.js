//GENERAL VARS
var edit_desk = $(".edit-desk")
var id = 0;
var id_selecionado;
var src_img_selecionada;

//SELECT ITENS
var inputTamWidth = $(`.controls .value-tam-width`)
var inputTamHeight = $(`.controls .value-tam-height`)
var btn_lock_unlock = $(".btn-lock-unlock")

//Mask input
$(document).ready(function(){
    $('.controls .value-tam').mask('000');
})

//Message before refresh
/*window.onbeforeunload = function(){
    return "Tem certeza que deseja sair? Todas as edições não serão perdidas se você sair."
}*/

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
                        width: 500px; 
                        height: auto; 
                        z-index: 1;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        -webkit-transform: translate(-50%, -50%);
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
    id++; //New id img
}

//Imagem Selecionada e Desselecionada
function selectedImage(id){
    desSelect() //Desselecionar/reseta a seleção tirando a borda vermelha
    
    var img = $(`.edit-desk img#${id}`);
    id_selecionado = id;
    src_img_selecionada = img.attr("src")
    
    //Refresh do botão de cortar imagem
    $(".btn_recorte_imagem").html(`<button onclick="cortarImagem()" type="button" class="btn btn-primary btn_cortar" data-toggle="modal" data-target="#modalCropCenter"><span class="iconify" data-icon="mdi:crop"></span> Cortar Imagem</button>`)

    //campo/imput do tamanho da imagem
    inputTamWidth.val(img.width())
    inputTamHeight.val(img.height())

    $(`.value-tam-height`).prop("disabled", false)
    $(`.value-tam-width`).prop("disabled", false)
    $(`.btn-lock-unlock`).prop("disabled", false)
    lockUnlock()

    //append no modal de recorte
    $(".modal .janela-area-de-recorte").html(`<img src="${src_img_selecionada}" class="imagem-recorte">`)
    	
    $(`#camada_${id}`).css({"border": "1px solid #1DFFF1"})
    img.css({"border": "1px solid #1DFFF1"})
}

function desSelect(){
    $(`.value-tam-height`).prop("disabled", true)
    $(`.value-tam-width`).prop("disabled", true)
    $(`.btn-lock-unlock`).prop("disabled", true)
    
    $(".edit-desk img").css({"border": "none"})
    $(`.camada_item`).css({"border": "none"})
    $(".btn_recorte_imagem").html('<button class="btn_cortar" disabled title="Selecione a imagem para cortar"><span class="iconify" data-icon="mdi:crop"></span> Cortar Imagem</button>')
    btn_lock_unlock.attr("title", "Selecione a imagem que deseja definir o tamanho")
    
    //campo/imput do tamanho da imagem
    inputTamHeight.val("")
    inputTamWidth.val("")
}

/*Aumentar imagem*/
var boolean_lockun = true;

function lockUnlock(){
    boolean_lockun = $(".check-lock-unlock").prop("checked")

    if(boolean_lockun == true){
        btn_lock_unlock.html('<span class="iconify" data-icon="fa-solid:lock"></span>')
        btn_lock_unlock.attr("title", "Proporções restringidas")
    }else{
        btn_lock_unlock.html('<span class="iconify" data-icon="fa-solid:lock-open"></span>')
        btn_lock_unlock.attr("title", "Proporções não restringidas")
    }
}

function sizeImageWidth(id){
    var img = $(`.edit-desk img#${id}`);

    if(boolean_lockun == true){
        img.css({
            "width": `${inputTamWidth.val()}px`,
            "height": `auto`
        })
        inputTamHeight.val(img.height())
    }else{
        img.css({
            "width": `${inputTamWidth.val()}px`
        })
    }
}

function sizeImageHeight(id){
    var img = $(`.edit-desk img#${id}`);

    if(boolean_lockun == true){
        img.css({
            "width": `auto`,
            "height": `${inputTamHeight.val()}px`
        })
        inputTamWidth.val(img.width())
    }else{
        img.css({
            "height": `${inputTamHeight.val()}px`
        })
    }
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
        minContainerHeight: 500,
        maxContainerWidth: 500,
        maxContainerHeight: 500
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
    $(".btn-download-image").hide()
    
    //Desseleciona os itens
    desSelect()

    function idRandom(){
        return Math.floor(Math.random() * 9999);
    }

    html2canvas($("#edit-desk")[0]).then(function(canvas) {
        $(".page-init").append(`<a class='anchor_download_image' download='EditMe_Image_${idRandom()}.jpg' href="${canvas.toDataURL()}">Baixar</a>`)
        $(".anchor_download_image").click()
        $(".anchor_download_image").remove()        
    });

    //Seleciona a imagem novamente
    selectedImage(id)

    //Mostra os botões
    $(".btn-add-image").show()
    $(".btn-download-image").show()
}
