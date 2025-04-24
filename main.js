import fs from 'fs/promises'
import bcrypt from 'bcrypt'
import PromptSync from 'prompt-sync'

const prompt = PromptSync()

const filePath = './db/bancoDeDados.json'
const userPath = './db/usuarios.json'

const saltRounds = 10

// AUTENTICAÇÃO

const lerUsuarios = async () => {
    try {
        const dados = await fs.readFile(userPath, 'utf-8')
        return JSON.parse(dados)
    } catch (error) {
        console.log(`Erro em ler usuários: ${error.message}`)
        return undefined
    }
}

const escreverUsuarios = async (escreverUser) => {
    await fs.writeFile(userPath, JSON.stringify(escreverUser, null, 2), 'utf-8')
    console.log("Arquivo atualizado com sucesso!")
}

const cadastrarUsuarios = async () => {
    const usuarios = await lerUsuarios()

    const usuario = prompt('Digite seu usuário: ')
    const existe = usuarios.find(u => u.usuario === usuario)

    if (existe) {
        console.log('Usuário existente!')
        return 
    }

    const senha = prompt('Digite sua senha: ', {echo: ''})
    const senhaCriptografada = await bcrypt.hash(senha, saltRounds)

    usuarios.push({usuario, senha: senhaCriptografada})
    await escreverUsuarios(usuarios)
    console.log(`O usuário ${usuario} foi cadastrado com sucesso!`)
}

const login = async () => {
    const usuarios = await lerUsuarios()

    const usuario = prompt("Digite seu usuário: ")
    
    const existe = usuarios.find(u => u.usuario === usuario)

    if (!existe) {
        console.log('Usuário não existente. Cadastre-se para acessar!')
        await new Promise(resolve => setTimeout(resolve, 3000))
        return await fluxoCode()
    }

    const senha = prompt("Digite sua senha: ", {echo: ''})
    const senhaCorreta = await bcrypt.compare(senha, existe.senha)

    if (senhaCorreta) {
        console.log(`Login efetuado com sucesso! Seja bem vindo ao sistema ${usuario}`)
        await new Promise(resolve => setTimeout(resolve, 3000))
        return await menu()
    }

    if (!senhaCorreta){
        console.log('Senha incorreta. Tente novamente!')
        return await login()
    }
}

await login()