//Move Layer to Up
function paraCima(id){
    var camada = $(`.camadas #camada_${id}`); // copia o conteudo da camada atual
    var cam_de_cima = $(`.camadas #camada_${id}`).prev(); //copia a camada anterior
    camada.after(cam_de_cima); // insere a camada em cima da outra

    //Imagem se inverte - vai para baixo
    var img = $(`.edit-desk img#${id}`); // copia o conteudo da última
    var img_de_cima = $(`.edit-desk img#${id}`).next(); //copia a camada de baixo
    img.before(img_de_cima) //insere na frente
}

//Move Layer to Down
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