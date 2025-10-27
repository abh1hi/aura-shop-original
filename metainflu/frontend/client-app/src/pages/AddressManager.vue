<template>
  <div>
    <!-- Desktop Two-Panel View -->
    <div v-if="!isMobile" class="grid grid-cols-12 gap-8">
      <!-- Left Panel: Address List -->
      <div class="col-span-5">
        <h2 class="text-2xl font-bold mb-4">Shipping Addresses</h2>
        <div class="space-y-3">
          <button @click="selectNewAddress" class="w-full text-left p-4 border-2 border-dashed rounded-lg hover:bg-gray-50 font-semibold text-indigo-600">+ Add New Address</button>
          <AddressListItem
            v-for="address in addresses"
            :key="address._id"
            :address="address"
            :selected="currentAddress && currentAddress._id === address._id"
            @select="selectAddressForEditing(address)"
          />
        </div>
      </div>

      <!-- Right Panel: Address Form -->
      <div class="col-span-7">
        <div class="sticky top-8">
          <h2 class="text-2xl font-bold mb-4">{{ formTitle }}</h2>
          <div class="bg-white p-8 rounded-lg shadow-md">
            <AddressForm 
              :address="currentAddress"
              @save="handleSave"
              @cancel="selectNewAddress"
              @delete="handleDelete"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile View -->
    <div v-else>
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Shipping Addresses</h2>
            <button @click="selectNewAddress" class="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm">Add New</button>
        </div>

        <div v-if="loading" class="text-center pt-10">
            <p>Loading addresses...</p>
        </div>
        <div v-else-if="error" class="text-center pt-10 text-red-500">
            <p>{{ error }}</p>
        </div>
        <div v-else-if="addresses.length === 0" class="text-center text-gray-500 py-12 border-2 border-dashed rounded-lg">
            <p>You have no saved addresses.</p>
        </div>

        <div v-else class="space-y-4">
            <AddressCard 
                v-for="address in addresses" 
                :key="address._id" 
                :address="address"
                @edit="selectAddressForEditing"
                @delete="handleDelete"
                @setDefault="handleSetDefault"
            />
        </div>

        <!-- Mobile Bottom Sheet for Address Form -->
        <BottomSheet :is-open="showSheet" @close="closeSheet" :title="formTitle">
            <AddressForm 
                :address="currentAddress"
                @save="handleSave"
                @cancel="closeSheet"
                @delete="handleDelete"
            />
        </BottomSheet>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useAddress } from '../composables/useAddress';
import AddressCard from '../components/AddressCard.vue';
import AddressListItem from '../components/AddressListItem.vue';
import AddressForm from '../components/AddressForm.vue';
import BottomSheet from '../components/BottomSheet.vue';

const { addresses, loading, error, fetchAddresses, saveAddress, removeAddress, makeDefaultAddress } = useAddress();

const isEditing = ref(false);
const currentAddress = ref({});
const showSheet = ref(false); // For mobile bottom sheet

const isMobile = ref(window.innerWidth < 768);

const formTitle = computed(() => isEditing.value ? 'Edit Address' : 'Add New Address');

const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

const selectNewAddress = () => {
  isEditing.value = false;
  currentAddress.value = { addressType: 'Home', country: 'USA' };
  if (isMobile.value) {
    showSheet.value = true;
  }
};

const selectAddressForEditing = (address) => {
  isEditing.value = true;
  currentAddress.value = { ...address };
  if (isMobile.value) {
    showSheet.value = true;
  }
};

const closeSheet = () => {
  showSheet.value = false;
};

const handleSave = async (addressData) => {
  await saveAddress(addressData);
  if (isMobile.value) {
    closeSheet();
  }
  // On desktop, after saving, we can select the newly added/edited address or go back to 'add new' state
  if (!addressData._id) { // If it was a new address
      selectNewAddress();
  }
};

const handleDelete = async (addressId) => {
  if (confirm('Are you sure you want to delete this address?')) {
    await removeAddress(addressId);
    selectNewAddress(); // Go back to Add New state after deleting
  }
};

const handleSetDefault = async (addressId) => {
  await makeDefaultAddress(addressId);
};

onMounted(() => {
  fetchAddresses();
  window.addEventListener('resize', handleResize);
  selectNewAddress(); // Initialize form for desktop
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

</script>
