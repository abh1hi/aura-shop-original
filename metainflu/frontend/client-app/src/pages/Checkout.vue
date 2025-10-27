<template>
  <div class="checkout-page">
    <PageHeader title="Checkout" />

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div v-if="isLoading || addressState.loading" class="text-center py-20">
        <p class="text-lg text-gray-500">Preparing checkout...</p>
      </div>
      <div v-else-if="error || addressState.error" class="text-center py-20">
        <p class="text-xl text-red-500">Error: {{ error || addressState.error }}</p>
        <router-link to="/cart" class="cta-button mt-4">Return to Cart</router-link>
      </div>
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <!-- Checkout Form -->
        <div class="lg:col-span-2">
          <div class="space-y-8">
            <!-- Shipping Information -->
            <div class="form-section">
              <h2 class="section-title">Shipping Information</h2>
              <div class="space-y-4">
                <div v-for="address in addressState.addresses" :key="address._id" @click="selectedAddressId = address._id" class="border rounded-lg p-4 cursor-pointer flex items-start space-x-4" :class="{ 'border-indigo-500 ring-2 ring-indigo-200': selectedAddressId === address._id }">
                  <input type="radio" :id="`address-${address._id}`" :value="address._id" v-model="selectedAddressId" class="mt-1 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                  <label :for="`address-${address._id}`" class="flex-1">
                    <div class="flex justify-between">
                      <p class="font-semibold">{{ address.fullName }}</p>
                      <span v-if="address.isDefault" class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Default</span>
                    </div>
                    <p>{{ address.streetAddress }}, {{ address.city }}, {{ address.state }} {{ address.postalCode }}</p>
                  </label>
                </div>
                <button @click="openAddModal" class="w-full text-left p-4 border-2 border-dashed rounded-lg hover:bg-gray-50">+ Add New Address</button>
              </div>
            </div>

            <!-- Payment Details -->
            <div class="form-section">
              <h2 class="section-title">Payment Details</h2>
              <form @submit.prevent class="space-y-6">
                <div class="form-group">
                  <label for="paymentMethod">Payment Method</label>
                  <select id="paymentMethod" required v-model="formData.paymentDetails.paymentMethod" class="form-input">
                    <option value="Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="card-number">Card Number</label>
                  <input type="text" id="card-number" required v-model="formData.paymentDetails.cardNumber" class="form-input" placeholder="**** **** **** 1234">
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <aside class="order-summary">
          <h2 class="text-xl font-bold mb-6">Order Summary</h2>
          <div class="space-y-4">
            <div v-for="item in cartItems" :key="item._id || (item.product && item.product._id)" class="flex justify-between items-center text-sm">
              <span class="text-gray-600">
                {{ item.product?.name }} (x{{ item.quantity }})
              </span>
              <span class="font-medium">
                ${{ linePrice(item).toFixed(2) }}
              </span>
            </div>
          </div>
          <div class="border-t border-gray-200 my-6"></div>
          <div class="space-y-4">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${{ cartTotal.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>${{ cartTotal.shipping.toFixed(2) }}</span>
            </div>
            <div class="border-t border-gray-200 my-4"></div>
            <div class="flex justify-between font-bold text-lg text-gray-900">
              <span>Total</span>
              <span>${{ cartTotal.total.toFixed(2) }}</span>
            </div>
          </div>
          <button @click="placeOrder" :disabled="isPlacingOrder || !selectedAddressId" class="place-order-btn">
            {{ isPlacingOrder ? 'Processing...' : 'Place Order' }}
          </button>
          <div v-if="orderError" class="mt-4 text-red-500 font-semibold text-center">{{ orderError }}</div>
        </aside>
      </div>
    </div>

    <!-- Modal for Address Form -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h3 class="text-xl font-bold mb-4">Add New Address</h3>
        <AddressForm 
          :address="{}"
          @save="handleSaveAddress"
          @cancel="closeModal"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import cartService from '../services/cartService';
import orderService from '../services/orderService';
import { useAddress } from '../composables/useAddress';
import { useRouter } from 'vue-router';
import PageHeader from '../components/PageHeader.vue';
import AddressForm from '../components/AddressForm.vue';

const router = useRouter();

const cartItems = ref([]);
const isLoading = ref(true);
const error = ref(null);

const isPlacingOrder = ref(false);
const orderError = ref(null);

const { addresses: addressState, fetchAddresses, saveAddress } = useAddress();
const selectedAddressId = ref(null);
const showModal = ref(false);

const formData = ref({
    shippingAddress: {},
    paymentDetails: {
        paymentMethod: 'Card',
        cardNumber: ''
    }
});

watch(selectedAddressId, (newId) => {
  if (newId) {
    formData.value.shippingAddress = addressState.value.find(a => a._id === newId);
  }
});

const fetchCart = async () => {
    isLoading.value = true;
    try {
        const data = await cartService.getCart();
        cartItems.value = (data.items || []).map(item => ({
          ...item,
          product: {
            ...(item.product || {}),
            price: Number(item.product?.price ?? 0)
          },
          variant: item.variant ? {
            ...item.variant,
            price: Number(item.variant?.price ?? item.product?.price ?? 0)
          } : null
        }));
        if (cartItems.value.length === 0) {
            error.value = "Your cart is empty. Please add items to proceed.";
        }
    } catch (err) {
        error.value = 'Failed to load cart: ' + err.message;
    } finally {
        isLoading.value = false;
    }
};

const unitPrice = (item) => {
  if (item?.variant && item.variant.price != null) return Number(item.variant.price) || 0;
  if (item?.product && item.product.price != null) return Number(item.product.price) || 0;
  return 0;
};

const linePrice = (item) => unitPrice(item) * (item.quantity || 0);

const cartTotal = computed(() => {
    const subtotal = cartItems.value.reduce((acc, item) => acc + linePrice(item), 0);
    const shipping = subtotal > 100 ? 0 : 10.00;
    const total = subtotal + shipping;
    
    return { subtotal, shipping, total };
});

const placeOrder = async () => {
    if (cartItems.value.length === 0) {
        orderError.value = "Cannot place order: Cart is empty.";
        return;
    }
    if (!selectedAddressId.value) {
        orderError.value = "Please select a shipping address.";
        return;
    }
    
    orderError.value = null;
    isPlacingOrder.value = true;
    
    try {
        const payload = {
            shippingAddress: formData.value.shippingAddress,
            paymentMethod: formData.value.paymentDetails.paymentMethod,
            items: cartItems.value.map(item => ({
              productId: item.product?._id,
              variantId: item.variant?._id,
              quantity: item.quantity,
              unitPrice: unitPrice(item),
              linePrice: linePrice(item)
            })),
            subtotal: cartTotal.value.subtotal,
            shippingCost: cartTotal.value.shipping,
            total: cartTotal.value.total,
        };

        const newOrder = await orderService.createOrder(payload);
        
        router.push({ name: 'OrderPlaced', query: { orderId: newOrder._id } });
        
    } catch (err) {
        orderError.value = 'Failed to place order: ' + (err.message || 'Unknown error');
    } finally {
        isPlacingOrder.value = false;
    }
};

const openAddModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleSaveAddress = async (addressData) => {
  await saveAddress(addressData);
  const defaultAddress = addressState.value.find(a => a.isDefault) || addressState.value[0];
  if (defaultAddress) {
    selectedAddressId.value = defaultAddress._id;
  }
  closeModal();
};

onMounted(async () => {
    await fetchCart();
    await fetchAddresses();
    const defaultAddress = addressState.value.find(a => a.isDefault) || (addressState.value.length > 0 ? addressState.value[0] : null);
    if (defaultAddress) {
      selectedAddressId.value = defaultAddress._id;
    }
});
</script>

<style scoped>
.checkout-page {
  background-color: #f9fafb;
  min-height: 100vh;
}

.form-section {
  background-color: #fff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #111827;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #4b5563;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.order-summary {
  background-color: #fff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  position: sticky;
  top: 120px;
}

.place-order-btn {
  display: block;
  width: 100%;
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 30px;
  background-color: #8b5cf6;
  color: white;
  font-weight: 700;
  text-align: center;
  transition: background-color 0.3s, transform 0.2s;
}
.place-order-btn:hover:not(:disabled) {
  background-color: #7c3aed;
  transform: translateY(-2px);
}
.place-order-btn:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

.cta-button {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.8rem 2.5rem;
  border-radius: 30px;
  background-color: #1a1a1a;
  color: white;
  font-weight: 600;
  transition: background-color 0.3s;
}
.cta-button:hover {
  background-color: #333;
}
</style>