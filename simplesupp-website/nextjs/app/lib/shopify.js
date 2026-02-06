// BEFORE LAUNCH: Test full checkout with Shopify test card (4242 4242 4242 4242)
// Configure Shopify Payments in Admin → Settings → Payments

// Shopify Storefront API Service
const SHOPIFY_DOMAIN = '671mam-tn.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = '0c065c971704ea64c81537bc81e8be16';
const COLLECTION_ID = 'gid://shopify/Collection/328225915070';

const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

// GraphQL query to fetch products from a collection
const GET_COLLECTION_PRODUCTS = `
  query getCollectionProducts($collectionId: ID!, $first: Int!) {
    collection(id: $collectionId) {
      id
      title
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            tags
            productType
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  }
`;

// GraphQL query to fetch a single product by ID
const GET_PRODUCT_BY_ID = `
  query getProductById($productId: ID!) {
    product(id: $productId) {
      id
      title
      description
      handle
      tags
      productType
      images(first: 20) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 1) {
        edges {
          node {
            id
            price {
              amount
              currencyCode
            }
            availableForSale
          }
        }
      }
    }
  }
`;

// Category mapping function - maps Shopify product tags/titles to categories
function mapProductToCategory(product) {
  const title = product.title.toLowerCase();
  const description = (product.description || '').toLowerCase();
  const tags = (product.tags || []).map(tag => tag.toLowerCase());
  const productType = (product.productType || '').toLowerCase();
  
  // Combine all text for matching
  const allText = `${title} ${description} ${tags.join(' ')} ${productType}`;
  
  // Performance category
  if (
    allText.includes('protein') ||
    allText.includes('whey') ||
    allText.includes('creatine') ||
    allText.includes('bcaa') ||
    allText.includes('pre-workout') ||
    allText.includes('post-workout') ||
    allText.includes('beta-alanine') ||
    allText.includes('performance') ||
    tags.includes('performance') ||
    tags.includes('muscle') ||
    tags.includes('strength')
  ) {
    return 'Performance';
  }
  
  // Weight Management category
  if (
    allText.includes('fat burner') ||
    allText.includes('weight loss') ||
    allText.includes('metabolism') ||
    allText.includes('thermogenic') ||
    allText.includes('l-carnitine') ||
    allText.includes('green tea') ||
    tags.includes('weight-loss') ||
    tags.includes('fat-loss') ||
    tags.includes('weight-management')
  ) {
    return 'Weight Management';
  }
  
  // Recovery & Sleep category
  if (
    allText.includes('magnesium') ||
    allText.includes('melatonin') ||
    allText.includes('sleep') ||
    allText.includes('sleep formula') ||
    allText.includes('sleep support') ||
    allText.includes('recovery') ||
    allText.includes('l-theanine') ||
    allText.includes('zma') ||
    allText.includes('ashwagandha') ||
    tags.includes('sleep') ||
    tags.includes('recovery') ||
    tags.includes('rest')
  ) {
    return 'Recovery & Sleep';
  }
  
  // Focus & Energy category
  if (
    allText.includes('caffeine') ||
    allText.includes('energy') ||
    allText.includes('focus') ||
    allText.includes('alpha energy') ||
    allText.includes('nootropic') ||
    allText.includes('rhodiola') ||
    allText.includes('l-theanine') ||
    tags.includes('focus') ||
    tags.includes('energy') ||
    tags.includes('cognitive') ||
    tags.includes('productivity')
  ) {
    return 'Focus & Energy';
  }
  
  // Beauty & Anti-Aging category
  if (
    allText.includes('collagen') ||
    allText.includes('biotin') ||
    allText.includes('beauty') ||
    allText.includes('skin') ||
    allText.includes('hair') ||
    allText.includes('anti-aging') ||
    allText.includes('vitamin c') ||
    tags.includes('beauty') ||
    tags.includes('skin') ||
    tags.includes('anti-aging')
  ) {
    return 'Beauty & Anti-Aging';
  }
  
  // Health & Wellness category (default for health products)
  if (
    allText.includes('omega') ||
    allText.includes('vitamin d') ||
    allText.includes('vitamin d3') ||
    allText.includes('coq10') ||
    allText.includes('multivitamin') ||
    allText.includes('health') ||
    allText.includes('wellness') ||
    allText.includes('immune') ||
    tags.includes('health') ||
    tags.includes('wellness') ||
    tags.includes('vitamins')
  ) {
    return 'Health & Wellness';
  }
  
  // Default to Health & Wellness if no match
  return 'Health & Wellness';
}

/**
 * Fetch a single product by ID from Shopify Storefront API
 */
export async function fetchProductById(productId) {
  try {
    // Convert numeric ID to Shopify GID format if needed
    const shopifyProductId = productId.toString().startsWith('gid://')
      ? productId
      : `gid://shopify/Product/${productId}`;

    const response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: GET_PRODUCT_BY_ID,
        variables: {
          productId: shopifyProductId,
        },
      }),
      cache: 'no-store', // Always fetch fresh inventory data
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('Shopify GraphQL errors:', data.errors);
      throw new Error('Failed to fetch product from Shopify');
    }

    if (!data.data.product) {
      throw new Error('Product not found');
    }

    const product = data.data.product;
    const variant = product.variants.edges[0]?.node;
    const image = product.images.edges[0]?.node;

    // Get all product images
    const allImages = product.images.edges.map(edge => edge.node.url);

    return {
      id: product.id,
      shopifyId: product.id,
      variantId: variant?.id,
      title: product.title,
      description: product.description || '',
      handle: product.handle,
      price: parseFloat(variant?.price.amount || 0),
      currencyCode: variant?.price.currencyCode || 'USD',
      image: image?.url || null,
      images: allImages,
      imageAlt: image?.altText || product.title,
      available: variant?.availableForSale || false,
      category: mapProductToCategory({
        title: product.title,
        description: product.description || '',
        tags: product.tags || [],
        productType: product.productType || '',
      }),
      tags: product.tags || [],
    };
  } catch (error) {
    console.error('Error fetching product from Shopify:', error);
    throw error;
  }
}

/**
 * Fetch products from Shopify Storefront API
 */
export async function fetchShopifyProducts() {
  try {
    const response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: GET_COLLECTION_PRODUCTS,
        variables: {
          collectionId: COLLECTION_ID,
          first: 50, // Fetch up to 50 products
        },
      }),
      cache: 'no-store', // Always fetch fresh inventory data
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('Shopify GraphQL errors:', data.errors);
      throw new Error('Failed to fetch products from Shopify');
    }

    // Transform Shopify products to a simpler format
    const products = data.data.collection.products.edges.map((edge) => {
      const product = edge.node;
      const variant = product.variants.edges[0]?.node;
      const image = product.images.edges[0]?.node;

      // Map product to category
      const category = mapProductToCategory({
        title: product.title,
        description: product.description || '',
        tags: product.tags || [],
        productType: product.productType || '',
      });

      // Get all product images
      const allImages = product.images.edges.map(edge => edge.node.url);
      
      return {
        id: product.id,
        shopifyId: product.id,
        variantId: variant?.id,
        title: product.title,
        description: product.description || '',
        handle: product.handle,
        price: parseFloat(variant?.price.amount || 0),
        currencyCode: variant?.price.currencyCode || 'USD',
        image: image?.url || null,
        images: allImages, // Array of all product images
        imageAlt: image?.altText || product.title,
        available: variant?.availableForSale || false,
        category: category,
        tags: product.tags || [],
      };
    });

    return products;
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    return [];
  }
}

/**
 * Initialize Shopify Buy Button SDK for cart functionality
 */
export function initializeShopifyCart() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'));
      return;
    }

    // Check if SDK is already loaded
    if (window.ShopifyBuy && window.ShopifyBuy.buildClient) {
      const client = window.ShopifyBuy.buildClient({
        domain: SHOPIFY_DOMAIN,
        storefrontAccessToken: STOREFRONT_ACCESS_TOKEN,
      });
      resolve(client);
      return;
    }

    // Load the SDK
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    script.onload = () => {
      if (!window.ShopifyBuy || !window.ShopifyBuy.buildClient) {
        reject(new Error('Shopify SDK failed to load'));
        return;
      }

      const client = window.ShopifyBuy.buildClient({
        domain: SHOPIFY_DOMAIN,
        storefrontAccessToken: STOREFRONT_ACCESS_TOKEN,
      });
      resolve(client);
    };
    script.onerror = () => {
      reject(new Error('Failed to load Shopify SDK'));
    };
    document.head.appendChild(script);
  });
}

/**
 * Get Shopify checkout URL
 * NOTE: If cart errors persist, restart Next.js dev server (Ctrl+C, npm run dev)
 */
export async function getCheckoutUrl() {
  try {
    if (typeof window === 'undefined') {
      return 'https://671mam-tn.myshopify.com/cart';
    }

    const cartId = localStorage.getItem('shopify_cart_id');
    if (cartId && window.ShopifyBuy && window.ShopifyBuy.buildClient) {
      try {
        const client = window.ShopifyBuy.buildClient({
          domain: '671mam-tn.myshopify.com',
          storefrontAccessToken: '0c065c971704ea64c81537bc81e8be16',
        });
        const cart = await client.checkout.fetch(cartId);
        // Use the checkout URL from the cart object
        if (cart && cart.webUrl) {
          return cart.webUrl;
        }
      } catch (e) {
        console.warn('Could not fetch cart for checkout URL:', e);
      }
    }
    
    // Fallback to general cart page
    return 'https://671mam-tn.myshopify.com/cart';
  } catch (error) {
    console.error('Error getting checkout URL:', error);
    return 'https://671mam-tn.myshopify.com/cart';
  }
}

/**
 * Get or create Shopify cart
 */
export async function getOrCreateCart() {
  try {
    const client = await initializeShopifyCart();
    
    // Get cart from localStorage
    let cartId = localStorage.getItem('shopify_cart_id');
    let cart;
    
    if (cartId) {
      try {
        cart = await client.checkout.fetch(cartId);
        // Verify cart is still valid
        if (!cart || !cart.id) {
          throw new Error('Invalid cart');
        }
      } catch (e) {
        // Cart doesn't exist or is invalid, create new one
        cart = await client.checkout.create();
        localStorage.setItem('shopify_cart_id', cart.id);
      }
    } else {
      cart = await client.checkout.create();
      localStorage.setItem('shopify_cart_id', cart.id);
    }
    
    return { client, cart };
  } catch (error) {
    console.error('Error getting/creating cart:', error);
    throw error;
  }
}

/**
 * Add product to Shopify cart
 */
export async function addToCart(variantId, quantity = 1) {
  try {
    const { client, cart } = await getOrCreateCart();
    
    // Add item to cart
    const lineItemsToAdd = [{
      variantId: variantId,
      quantity: quantity,
    }];

    const updatedCart = await client.checkout.addLineItems(cart.id, lineItemsToAdd);
    
    // Update cart in localStorage
    localStorage.setItem('shopify_cart_id', updatedCart.id);
    
    // NOTE: If cart errors persist, restart Next.js dev server (Ctrl+C, npm run dev)
    
    // Cart automatically updates via SDK - no need for updateComponent (doesn't exist in newer SDK versions)
    // Just trigger a custom event for UI updates
    if (typeof window !== 'undefined') {
      const itemCount = updatedCart.lineItems.reduce((sum, item) => sum + item.quantity, 0);
      window.dispatchEvent(new CustomEvent('shopify:cart:updated', { 
        detail: { 
          cart: updatedCart,
          itemCount: itemCount,
          lineItems: updatedCart.lineItems
        } 
      }));
    }

    return updatedCart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

/**
 * Add multiple products to Shopify cart at once
 */
export async function addMultipleToCart(items) {
  try {
    const { client, cart } = await getOrCreateCart();
    
    // Prepare line items
    const lineItemsToAdd = items.map(item => ({
      variantId: item.variantId,
      quantity: item.quantity || 1,
    }));

    const updatedCart = await client.checkout.addLineItems(cart.id, lineItemsToAdd);
    
    // Update cart in localStorage
    localStorage.setItem('shopify_cart_id', updatedCart.id);
    
    // NOTE: If cart errors persist, restart Next.js dev server (Ctrl+C, npm run dev)
    
    // Cart automatically updates via SDK - no need for updateComponent (doesn't exist in newer SDK versions)
    // Just trigger a custom event for UI updates
    if (typeof window !== 'undefined') {
      const itemCount = updatedCart.lineItems.reduce((sum, item) => sum + item.quantity, 0);
      window.dispatchEvent(new CustomEvent('shopify:cart:updated', { 
        detail: { 
          cart: updatedCart,
          itemCount: itemCount,
          lineItems: updatedCart.lineItems
        } 
      }));
    }

    return updatedCart;
  } catch (error) {
    console.error('Error adding multiple items to cart:', error);
    throw error;
  }
}

