<template>
  <div class="flex card justify-content-center">
    <Button type="button" icon="pi pi-image" label="Image" @click="toggle" />

    <Popover ref="op">
      <div class="flex gap-3 flex-column w-25rem">
        <div>
          <span class="block mb-2 font-medium text-900"
            >Share this document</span
          >
          <InputGroup>
            <InputText
              value="https://primevue.org/12323ff26t2g243g423g234gg52hy25XADXAG3"
              readonly
              class="w-25rem"
            ></InputText>
            <InputGroupAddon>
              <i class="pi pi-copy"></i>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div>
          <span class="block mb-2 font-medium text-900">Invite Member</span>
          <InputGroup>
            <InputText disabled />
            <Button label="Invite" icon="pi pi-users"></Button>
          </InputGroup>
        </div>
        <div>
          <span class="block mb-2 font-medium text-900">Team Members</span>
          <ul class="flex gap-3 p-0 m-0 list-none flex-column">
            <li
              v-for="member in members"
              :key="member.name"
              class="flex gap-2 align-items-center"
            >
              <img
                :src="`https://primefaces.org/cdn/primevue/images/avatar/${member.image}`"
                style="width: 32px"
              />
              <div>
                <span class="font-medium">{{ member.name }}</span>
                <div class="text-sm text-color-secondary">
                  {{ member.email }}
                </div>
              </div>
              <div
                class="flex gap-2 ml-auto text-sm align-items-center text-color-secondary"
              >
                <span>{{ member.role }}</span>
                <i class="pi pi-angle-down"></i>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Popover>
  </div>
</template>

<script setup>
import { ref } from "vue";

const op = ref();
const members = ref([
  {
    name: "Amy Elsner",
    image: "amyelsner.png",
    email: "amy@email.com",
    role: "Owner",
  },
  {
    name: "Bernardo Dominic",
    image: "bernardodominic.png",
    email: "bernardo@email.com",
    role: "Editor",
  },
  {
    name: "Ioni Bowcher",
    image: "ionibowcher.png",
    email: "ioni@email.com",
    role: "Viewer",
  },
]);

const toggle = (event) => {
  op.value.toggle(event);
};
</script>
