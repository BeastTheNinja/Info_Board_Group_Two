export const Fragment = () => {
    const element = document.createDocumentFragment();
    return element;
}

export const Div = (className = 'normal') => {
    const element = document.createElement('div');
    element.className = className;
    return element;
}

export const Paragraph = (className = 'normal') => {
    const element = document.createElement('p');
    element.className = className;
    return element;
}

export const Heading = (text, num = 1) => {
    const element = document.createElement(`h${num}`);
    element.innerText = text;
    
    return element;
} 

export const Ul = (className = 'normal') => {
    const element = document.createElement('ul');
    element.className = className;
    return element;
}

export const Li = (className = 'normal') => {
    const element = document.createElement('li');
    element.className = className;
    return element;
}

export const Image = (src, title, className = '') => {
    const element = document.createElement('img')
    element.src = src
    element.className = className
    element.alt = title
    element.title = title
    return element
}

export const Form = (method = 'GET') => {
    const element = document.createElement('form')
    element.method = method
    return element
}

export const Label = (title, id, className = 'mr-4') => {
    const element = document.createElement('label')
    element.htmlFor = id
    element.innerText = title
    element.className = className
    return element
}