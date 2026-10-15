
/*
 * SalesSavvy Unified API Client
 * Uses HttpOnly cookie authentication.
 */

const API_BASE_URL = "http://localhost:9090";

async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = {
        ...(options.headers || {}),
    };

    const config = {
        ...options,
        headers,
        credentials: "include",
    };

    // Set JSON content type only when sending a JSON body.
    if (
        options.body !== undefined &&
        options.body !== null &&
        !(options.body instanceof FormData)
    ) {
        headers["Content-Type"] = "application/json";

        if (typeof options.body === "object") {
            config.body = JSON.stringify(options.body);
        }
    }

    try {
        const response = await fetch(url, config);
        const contentType = response.headers.get("content-type") || "";

        let data;

        if (contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            let errorMessage = "An error occurred";

            if (typeof data === "object" && data !== null) {
                errorMessage =
                    data.error ||
                    data.message ||
                    JSON.stringify(data);
            } else if (typeof data === "string" && data.trim()) {
                errorMessage = data;
            }

            const error = new Error(errorMessage);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (err) {
        console.error(
            `[API Error] ${options.method || "GET"} ${endpoint}:`,
            err.message
        );
        throw err;
    }
}

export const api = {
    // Authentication
    auth: {
        login: (username, password) =>
            request("/api/auth/login", {
                method: "POST",
                body: { username, password },
            }),

        logout: () =>
            request("/api/auth/logout", {
                method: "POST",
            }),
    },

    // User registration
    users: {
        register: (userData) =>
            request("/api/users/register", {
                method: "POST",
                body: userData,
            }),
    },

    // Products
    products: {
        getAll: (category) => {
            const query =
                category && category !== "All"
                    ? `?category=${encodeURIComponent(category)}`
                    : "";

            return request(`/api/products${query}`);
        },
    },

    // Cart
    cart: {
        getItems: () => request("/api/cart/items"),

        getItemCount: (username) =>
            request(
                `/api/cart/items/count?username=${encodeURIComponent(username)}`
            ),

        addItem: (username, productId, quantity = 1) =>
            request("/api/cart/add", {
                method: "POST",
                body: { username, productId, quantity },
            }),

        updateQuantity: (username, productId, quantity) =>
            request("/api/cart/update", {
                method: "PUT",
                body: { username, productId, quantity },
            }),

        removeItem: (username, productId) =>
            request("/api/cart/delete", {
                method: "DELETE",
                body: { username, productId },
            }),
    },

    // Orders
    orders: {
        getUserOrders: () => request("/api/orders"),
    },

    // Payments (Razorpay)
    payment: {
        createOrder: (totalAmount, cartItems) =>
            request("/api/payment/create", {
                method: "POST",
                body: { totalAmount, cartItems },
            }),

        verifyPayment: (
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        ) =>
            request("/api/payment/verify", {
                method: "POST",
                body: {
                    razorpayOrderId,
                    razorpayPaymentId,
                    razorpaySignature,
                },
            }),
    },

    // Admin APIs
    admin: {
        business: {
            getOverall: () =>
                request("/admin/business/overall"),

            getYearly: (year) =>
                request(`/admin/business/yearly?year=${year}`),

            getMonthly: (month, year) =>
                request(
                    `/admin/business/monthly?month=${month}&year=${year}`
                ),

            getDaily: (dateStr) =>
                request(
                    `/admin/business/daily?date=${encodeURIComponent(dateStr)}`
                ),
        },

        products: {
            add: (productData) =>
                request("/admin/products/add", {
                    method: "POST",
                    body: productData,
                }),

            delete: (productId) =>
                request("/admin/products/delete", {
                    method: "DELETE",
                    body: { productId: Number(productId) },
                }),
        },

        users: {
            getById: (userId) =>
                request("/admin/user/getbyid", {
                    method: "POST",
                    body: { userId: Number(userId) },
                }),

            modify: (userId, username, email, role) =>
                request("/admin/user/modify", {
                    method: "PUT",
                    body: {
                        userId: Number(userId),
                        username,
                        email,
                        role,
                    },
                }),
        },
    },
};
