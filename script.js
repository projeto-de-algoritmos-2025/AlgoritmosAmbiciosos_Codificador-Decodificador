// script.js

// Classe para representar um nó na árvore de Huffman
class Node {
    constructor(char, freq, left = null, right = null) {
        this.char = char; // Caractere (null para nós internos)
        this.freq = freq; // Frequência
        this.left = left; // Filho esquerdo
        this.right = right; // Filho direito
    }
}

// Função para construir a árvore de Huffman
function buildHuffmanTree(text) {
    // 1. Calcular a frequência de cada caractere
    const frequencies = {};
    for (const char of text) {
        frequencies[char] = (frequencies[char] || 0) + 1;
    }

    // 2. Criar uma lista de nós (folhas)
    const nodes = [];
    for (const char in frequencies) {
        nodes.push(new Node(char, frequencies[char]));
    }

    // 3. Construir a árvore (algoritmo guloso)
    // Usamos um array e o ordenamos a cada iteração para simular uma fila de prioridade
    while (nodes.length > 1) {
        nodes.sort((a, b) => a.freq - b.freq); // Ordena por frequência crescente

        const left = nodes.shift(); // Remove o nó de menor frequência
        const right = nodes.shift(); // Remove o próximo nó de menor frequência

        // Cria um novo nó interno
        const newNode = new Node(null, left.freq + right.freq, left, right);
        nodes.push(newNode); // Adiciona o novo nó de volta à lista
    }

    return nodes[0]; // O nó restante é a raiz da árvore de Huffman
}

// Função para gerar os códigos Huffman
function generateHuffmanCodes(root) {
    const codes = {};

    function traverse(node, currentCode) {
        if (node.char !== null) { // É uma folha (caractere)
            codes[node.char] = currentCode;
            return;
        }

        // Percorre a subárvore esquerda com '0'
        if (node.left) {
            traverse(node.left, currentCode + '0');
        }
        // Percorre a subárvore direita com '1'
        if (node.right) {
            traverse(node.right, currentCode + '1');
        }
    }

    traverse(root, ''); // Começa a travessia da raiz com um código vazio
    return codes;
}

// Função para criptografar (codificar) o texto
function encryptText(text, huffmanCodes) {
    let encryptedText = '';
    for (const char of text) {
        if (huffmanCodes[char]) {
            encryptedText += huffmanCodes[char];
        } else {
            // Lida com caracteres que não estavam no texto original usado para construir a árvore
            // Para simplicidade, vamos ignorar. Em um cenário real, você teria que decidir como lidar.
            // Para este trabalho, presuma que o texto de entrada para encriptar e decriptar usa o mesmo alfabeto.
            console.warn(`Caractere '${char}' não encontrado no mapa de códigos.`);
        }
    }
    return encryptedText;
}

// Função para descriptografar (decodificar) o código
function decryptCode(encodedText, huffmanCodes) {
    let decryptedText = '';
    let currentCode = '';

    // Inverte o mapa de códigos para facilitar a busca (código -> caractere)
    const reverseHuffmanCodes = {};
    for (const char in huffmanCodes) {
        reverseHuffmanCodes[huffmanCodes[char]] = char;
    }

    for (const bit of encodedText) {
        currentCode += bit;
        if (reverseHuffmanCodes[currentCode]) {
            decryptedText += reverseHuffmanCodes[currentCode];
            currentCode = ''; // Reseta o código atual
        }
    }
    return decryptedText;
}

// Event Listeners para os botões
document.getElementById('encryptButton').addEventListener('click', () => {
    const inputText = document.getElementById('inputText').value;
    if (!inputText) {
        alert('Por favor, digite algum texto para criptografar.');
        return;
    }

    const huffmanTree = buildHuffmanTree(inputText);
    const huffmanCodes = generateHuffmanCodes(huffmanTree);
    const encryptedText = encryptText(inputText, huffmanCodes);

    document.getElementById('encryptedOutput').value = encryptedText;
    document.getElementById('codeMapOutput').value = JSON.stringify(huffmanCodes, null, 2); // Exibe o mapa formatado
});

document.getElementById('decryptButton').addEventListener('click', () => {
    const inputCode = document.getElementById('inputCode').value;
    const inputCodeMap = document.getElementById('inputCodeMap').value;

    if (!inputCode || !inputCodeMap) {
        alert('Por favor, cole o código criptografado e o mapa de códigos para descriptografar.');
        return;
    }

    try {
        const huffmanCodes = JSON.parse(inputCodeMap);
        const decryptedText = decryptCode(inputCode, huffmanCodes);
        document.getElementById('decryptedOutput').value = decryptedText;
    } catch (e) {
        alert('Erro ao processar o mapa de códigos. Certifique-se de que é um JSON válido.');
        console.error(e);
    }
});