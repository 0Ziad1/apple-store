const allProducts = [ /* your products */ ];

const bestSellers = [
    allProducts.find(p => p.name === 'Sparkle Pack'),
    allProducts.find(p => p.name === 'Star Bundle'),
    allProducts.find(p => p.name === 'Football Pack'),
    allProducts.find(p => p.name === 'Anime Pack')
];
