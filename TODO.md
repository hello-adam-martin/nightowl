1. Update topBar to give clearer info regarding opening hours
2. Cart is checking qty from config instead of from the products in Supabase - it is working correctly in product-grid
3. When we save an order in supabase... then we need to adjust the inventory - best to do this at database level
5. If inventory levels change after an item has been added to the cart.. we need to deal with this