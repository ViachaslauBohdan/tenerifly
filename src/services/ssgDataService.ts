// Сервис для получения данных на сервере для SSG

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
});

// Получение всех апартаментов
export async function getAllProperties() {
  try {
    const response = await fetch(
      `${API_URL}/api/properties?populate=*&pagination[pageSize]=1000`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

// Получение всех автомобилей
export async function getAllCars() {
  try {
    const response = await fetch(
      `${API_URL}/api/cars?populate=*&pagination[pageSize]=1000`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
}

// Получение всех экскурсий
export async function getAllTours() {
  try {
    const response = await fetch(
      `${API_URL}/api/tours?populate=*&pagination[pageSize]=1000`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching tours:", error);
    return [];
  }
}

// Получение блогов
export async function getAllBlogs() {
  try {
    const response = await fetch(
      `${API_URL}/api/blogs?populate=*&pagination[pageSize]=100`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

// Получение всех данных для главной страницы
export async function getHomePageData() {
  try {
    const [properties, cars, tours, blogs] = await Promise.all([
      getAllProperties(),
      getAllCars(),
      getAllTours(),
      getAllBlogs(),
    ]);

    return {
      properties,
      cars,
      tours,
      blogs,
    };
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return {
      properties: [],
      cars: [],
      tours: [],
      blogs: [],
    };
  }
}

// Получение всех ID апартаментов для генерации статических путей
export async function getAllPropertyIds() {
  try {
    const response = await fetch(
      `${API_URL}/api/properties?fields=id&pagination[pageSize]=1000`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.map((item: any) => item.id) || [];
  } catch (error) {
    console.error("Error fetching property IDs:", error);
    return [];
  }
}

// Получение отдельного апартамента по ID
export async function getPropertyById(id: string) {
  try {
    const response = await fetch(`${API_URL}/api/properties/${id}?populate=*`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
}

// Получение всех ID автомобилей для генерации статических путей
export async function getAllCarIds() {
  try {
    const response = await fetch(
      `${API_URL}/api/cars?fields=id&pagination[pageSize]=1000`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.map((item: any) => item.id) || [];
  } catch (error) {
    console.error("Error fetching car IDs:", error);
    return [];
  }
}

// Получение отдельного автомобиля по ID
export async function getCarById(id: string) {
  try {
    const response = await fetch(`${API_URL}/api/cars/${id}?populate=*`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching car:", error);
    return null;
  }
}

// Получение всех ID экскурсий для генерации статических путей
export async function getAllTourIds() {
  try {
    const response = await fetch(
      `${API_URL}/api/tours?fields=id&pagination[pageSize]=1000`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.map((item: any) => item.id) || [];
  } catch (error) {
    console.error("Error fetching tour IDs:", error);
    return [];
  }
}

// Получение отдельной экскурсии по ID
export async function getTourById(id: string) {
  try {
    const response = await fetch(`${API_URL}/api/tours/${id}?populate=*`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching tour:", error);
    return null;
  }
}

// Получение всех ID блогов для генерации статических путей
export async function getAllBlogIds() {
  try {
    const response = await fetch(
      `${API_URL}/api/blogs?fields=id&pagination[pageSize]=1000`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.map((item: any) => item.id) || [];
  } catch (error) {
    console.error("Error fetching blog IDs:", error);
    return [];
  }
}

// Получение отдельного блога по ID
export async function getBlogById(id: string) {
  try {
    const response = await fetch(`${API_URL}/api/blogs/${id}?populate=*`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}
