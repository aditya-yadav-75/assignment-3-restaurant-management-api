const express = require("express");

const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const restaurants = await Restaurant.find();

        res.status(200).json({
            message: "Restaurants fetched successfully",
            restaurants: restaurants
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch restaurants",
            error: error.message
        });
    }
});

router.get("/top", async (req, res) => {
    try {
        const restaurants = await Restaurant.find()
            .sort({ rating: -1 })
            .limit(5);

        res.status(200).json({
            message: "Top restaurants fetched successfully",
            restaurants: restaurants
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch top restaurants",
            error: error.message
        });
    }
});

router.get("/:id/menu", async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        const menuItems = await MenuItem.find({
            restaurantId: req.params.id
        });

        res.status(200).json({
            message: "Menu fetched successfully",
            menuItems: menuItems
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch menu",
            error: error.message
        });
    }
});

router.post("/:id/menu", auth, async (req, res) => {
    try {
        const {
            name,
            price,
            isAvailable
        } = req.body;

        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        if (!name || price === undefined) {
            return res.status(400).json({
                message: "Menu item name and price are required"
            });
        }

        const menuItem = await MenuItem.create({
            restaurantId: req.params.id,
            name: name,
            price: price,
            isAvailable:
                isAvailable === undefined
                    ? true
                    : isAvailable
        });

        res.status(201).json({
            message: "Menu item added successfully",
            menuItem: menuItem
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add menu item",
            error: error.message
        });
    }
});

router.put("/menu/:id", auth, async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        res.status(200).json({
            message: "Menu item updated successfully",
            menuItem: menuItem
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update menu item",
            error: error.message
        });
    }
});

router.delete("/menu/:id", auth, async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(
            req.params.id
        );

        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        res.status(200).json({
            message: "Menu item deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete menu item",
            error: error.message
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(
            req.params.id
        );

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        res.status(200).json({
            message: "Restaurant fetched successfully",
            restaurant: restaurant
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch restaurant",
            error: error.message
        });
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const {
            name,
            city,
            address,
            cuisine,
            rating
        } = req.body;

        if (
            !name ||
            !city ||
            !address ||
            !cuisine ||
            rating === undefined
        ) {
            return res.status(400).json({
                message: "All restaurant fields are required"
            });
        }

        const restaurant = await Restaurant.create({
            name: name,
            city: city,
            address: address,
            cuisine: cuisine,
            rating: rating
        });

        res.status(201).json({
            message: "Restaurant created successfully",
            restaurant: restaurant
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create restaurant",
            error: error.message
        });
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        res.status(200).json({
            message: "Restaurant updated successfully",
            restaurant: restaurant
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update restaurant",
            error: error.message
        });
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(
            req.params.id
        );

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        await MenuItem.deleteMany({
            restaurantId: req.params.id
        });

        res.status(200).json({
            message: "Restaurant deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete restaurant",
            error: error.message
        });
    }
});

module.exports = router;