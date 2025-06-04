        let basket = [];
        let currentItem = null;

        function showItemModal(item) {
            const modal = document.getElementById('itemModal');
            const modalImage = document.getElementById('modalImage');
            const modalTitle = document.getElementById('modalTitle');
            const modalPrice = document.getElementById('modalPrice');
            const modalRarity = document.getElementById('modalRarity');
            const modalSlot = document.getElementById('modalSlot');

            currentItem = {
                image: item.getAttribute('data-item-image'),
                name: item.getAttribute('data-item-name'),
                price: parseFloat(item.getAttribute('data-item-price')),
                rarity: item.getAttribute('data-item-rarity'),
                type: item.getAttribute('data-item-type'),
                slot: item.getAttribute('data-item-slot')
            };

            modalImage.src = currentItem.image;
            modalTitle.textContent = currentItem.name;
            modalPrice.textContent = currentItem.price.toFixed(2).replace('.', ',') + '$';
            modalRarity.textContent = currentItem.rarity;
            modalSlot.textContent = currentItem.slot;

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function hideItemModal() {
            document.getElementById('itemModal').style.display = 'none';
            document.body.style.overflow = 'auto';
            currentItem = null;
        }

        function addToBasket() {
            if (currentItem) {
                basket.push(currentItem);
                updateBasket();
                hideItemModal();
                alert('Товар добавлен в корзину!');
            }
        }

        function updateBasket() {
            const basketItems = document.getElementById('basketItems');
            const basketTotal = document.getElementById('basketTotal');
            const selectedItemsText = document.getElementById('selectedItemsText');
            const selectedItemsPreview = document.getElementById('selectedItemsPreview');
            
            basketItems.innerHTML = '';
            selectedItemsPreview.innerHTML = '';
            
            let total = 0;
            
            basket.forEach((item, index) => {
                total += item.price;
                
                const itemElement = document.createElement('div');
                itemElement.className = 'basket-item';
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="basket-item-name">${item.name}</div>
                    <div class="basket-item-price">${item.price.toFixed(2).replace('.', ',')}$</div>
                    <button onclick="removeFromBasket(${index})" style="margin-top: 10px; background: #ff4d4d; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Удалить</button>
                `;
                basketItems.appendChild(itemElement);
                
                if (index < 3) {
                    const previewImg = document.createElement('img');
                    previewImg.src = item.image;
                    previewImg.className = 'selected-item-img';
                    previewImg.alt = item.name;
                    selectedItemsPreview.appendChild(previewImg);
                }
            });
            
            if (basket.length > 3) {
                const counter = document.createElement('span');
                counter.textContent = `+${basket.length - 3}`;
                counter.style.marginLeft = '5px';
                selectedItemsPreview.appendChild(counter);
            }
            
            selectedItemsText.textContent = basket.length === 0 ? 'Выберите товары (0)' : 
                `${total.toFixed(2).replace('.', ',')}$ (${basket.length} товаров)`;
            basketTotal.textContent = total.toFixed(2).replace('.', ',') + '$';
        }

        function removeFromBasket(index) {
            basket.splice(index, 1);
            updateBasket();
        }

        function clearBasket() {
            basket = [];
            updateBasket();
            hideBasket();
        }

        function openBasket() {
            if (basket.length === 0) {
                alert('Корзина пуста!');
                return;
            }
            
            document.getElementById('basketModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function hideBasket() {
            document.getElementById('basketModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function updatePriceFilter() {
            const priceRange = document.getElementById('priceRange');
            const priceValue = document.getElementById('priceValue');
            priceValue.textContent = priceRange.value + '$';
            filterItems();
        }

        function filterItems() {
            const searchInput = document.getElementById('searchInput').value.toLowerCase();
            const maxPrice = parseFloat(document.getElementById('priceRange').value);
            
            const selectedRarities = getSelectedCheckboxes('rarity');
            const selectedTypes = getSelectedCheckboxes('type');
            const selectedSlots = getSelectedCheckboxes('slot');
            
            const items = document.querySelectorAll('.item');
            
            items.forEach(item => {
                const name = item.getAttribute('data-item-name').toLowerCase();
                const price = parseFloat(item.getAttribute('data-item-price'));
                const rarity = item.getAttribute('data-item-rarity');
                const type = item.getAttribute('data-item-type');
                const slot = item.getAttribute('data-item-slot');
                
                const nameMatch = name.includes(searchInput);
                const priceMatch = price <= maxPrice;
                const rarityMatch = selectedRarities.includes(rarity);
                const typeMatch = selectedTypes.includes(type);
                const slotMatch = selectedSlots.includes(slot);
                
                if (nameMatch && priceMatch && rarityMatch && typeMatch && slotMatch) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        function getSelectedCheckboxes(name) {
            const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
            return Array.from(checkboxes).map(cb => cb.value);
        }

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                hideItemModal();
                hideBasket();
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            updatePriceFilter();
        });