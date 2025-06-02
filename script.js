
class Node {
    constructor(char, freq, left = null, right = null) {
        this.char = char;
        this.freq = freq;
        this.left = left;
        this.right = right;
    }
}


function buildHuffmanTree(text) {
    const frequencies = {};
    for (const char of text) {
        frequencies[char] = (frequencies[char] || 0) + 1;
    }

    const nodes = [];
    for (const char in frequencies) {
        nodes.push(new Node(char, frequencies[char]));
    }

    while (nodes.length > 1) {
        nodes.sort((a, b) => a.freq - b.freq);
        const left = nodes.shift();
        const right = nodes.shift();
        const newNode = new Node(null, left.freq + right.freq, left, right);
        nodes.push(newNode);
    }
    return nodes[0];
}


function generateHuffmanCodes(root) {
    const codes = {};
    function traverse(node, currentCode) {
        if (node.char !== null) {
            codes[node.char] = currentCode;
            return;
        }
        if (node.left) {
            traverse(node.left, currentCode + '0');
        }
        if (node.right) {
            traverse(node.right, currentCode + '1');
        }
    }
    if (root) { 
        traverse(root, '');
    }
    return codes;
}


function encryptText(text, huffmanCodes) {
    let encryptedText = '';
    for (const char of text) {
        if (huffmanCodes[char]) {
            encryptedText += huffmanCodes[char];
        } else {
            console.warn(`Caractere '${char}' não encontrado no mapa de códigos.`);
        }
    }
    return encryptedText;
}


function decryptCode(encodedText, huffmanCodes) {
    let decryptedText = '';
    let currentCode = '';
    const reverseHuffmanCodes = {};
    for (const char in huffmanCodes) {
        reverseHuffmanCodes[huffmanCodes[char]] = char;
    }

    for (const bit of encodedText) {
        currentCode += bit;
        if (reverseHuffmanCodes[currentCode]) {
            decryptedText += reverseHuffmanCodes[currentCode];
            currentCode = '';
        }
    }
    
    if (currentCode !== '' && !reverseHuffmanCodes[currentCode]) {
        console.warn(`Código final incompleto ou inválido: ${currentCode}`);
        
        
    }
    return decryptedText;
}


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
    document.getElementById('codeMapOutput').value = JSON.stringify(huffmanCodes, null, 2);
});

document.getElementById('decryptButton').addEventListener('click', () => {
    const inputCode = document.getElementById('inputCode').value;
    const inputCodeMap = document.getElementById('inputCodeMap').value;

    if (!inputCode) { 
        alert('Por favor, cole o código criptografado.');
        return;
    }
    if (!inputCodeMap) {
        alert('Por favor, cole o mapa de códigos para descriptografar.');
        return;
    }

    try {
        const huffmanCodes = JSON.parse(inputCodeMap);
        if (Object.keys(huffmanCodes).length === 0 && inputCode.length > 0) {
            alert('O mapa de códigos está vazio, mas há um código para decifrar. Verifique o mapa.');
            return;
        }
        const decryptedText = decryptCode(inputCode, huffmanCodes);
        document.getElementById('decryptedOutput').value = decryptedText;
    } catch (e) {
        alert('Erro ao processar o mapa de códigos. Certifique-se de que é um JSON válido.\nDetalhe: ' + e.message);
        console.error(e);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSelector = button.getAttribute('data-clipboard-target');
            const textarea = document.querySelector(targetSelector);

            if (textarea && textarea.value) {
                navigator.clipboard.writeText(textarea.value)
                    .then(() => {
                        const originalButtonText = button.textContent;
                        button.textContent = 'Copiado!';
                        button.disabled = true;
                        setTimeout(() => {
                            button.textContent = originalButtonText;
                            button.disabled = false;
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Erro ao copiar texto: ', err);
                        
                        try {
                            textarea.select();
                            document.execCommand('copy');
                            const originalButtonText = button.textContent;
                            button.textContent = 'Copiado!';
                            button.disabled = true;
                            setTimeout(() => {
                                button.textContent = originalButtonText;
                                button.disabled = false;
                            }, 2000);
                        } catch (fallbackError) {
                            console.error('Erro no fallback de cópia: ', fallbackError);
                            alert('Erro ao copiar. Seu navegador pode não suportar esta funcionalidade ou a página não é segura (HTTPS).');
                        }
                    });
            } else {
                alert('Nada para copiar.');
            }
        });
    });
});