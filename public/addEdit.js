import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showItems } from "./items.js";

let addEditDiv = null;
let name = null;
let description = null;
let quantity = null;
let category = null;
let addingItem = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-item");
  name = document.getElementById("item-name");
  description = document.getElementById("item-description");
  quantity = document.getElementById("item-quantity");
  category = document.getElementById("item-category");
  addingItem = document.getElementById("adding-item");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingItem) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/items";

        if (addingItem.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/items/${addEditDiv.dataset.id}`;
        }
        if (addingItem)
          try {
            const response = await fetch(url, {
              method: method,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                name: name.value,
                description: description.value,
                quantity: quantity.value,
                category: category.value,
              }),
            });

            const data = await response.json();
            if (response.status === 200 || response.status === 201) {
              if (response.status === 200) {
                // a 200 is expected for a successful update
                message.textContent = "The item entry was updated.";
              } else {
                // a 201 is expected for a successful create
                message.textContent = "The item entry was created.";
              }

              name.value = "";
              description.value = "";
              quantity.value = null;
              category.value = "";
              showItems();
            } else {
              message.textContent = data.msg;
            }
          } catch (err) {
            console.log(err);
            message.textContent = "A communication error occurred.";
          }
        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showItems();
      }
    }
  });
};

export const showAddEdit = async (itemId) => {
  if (!itemId) {
    name.value = "";
    description.value = "";
    quantity.value = null;
    category.value = "";
    addingItem.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/items/${itemId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        name.value = data.item.name;
        description.value = data.item.description;
        quantity.value = data.item.quantity;
        category.value = data.item.category;
        addingItem.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = itemId;

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The items entry was not found";
        showItems();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showItems();
    }

    enableInput(true);
  }
};

export const handleDelete = async (itemId) => {
  if (!itemId) {
    name.value = "";
    description.value = "";
    quantity.value = null;
    category.value = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/items/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        message.textContent = "Item deleted successfully";
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The items entry was not found";
      }
      showItems();
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showItems();
    }

    enableInput(true);
  }
};
