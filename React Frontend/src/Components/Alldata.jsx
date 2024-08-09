import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Alldata = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://localhost:7006/api/working/get-products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`https://localhost:7006/api/working/delete-product/${productId}`);
      alert('Product deleted successfully');
      const updatedProducts = products.filter(product => product.id !== productId);
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error deleting product', error);
      alert('Error deleting product');
    }
  };

  const handleUpdate = (productId) => {
    navigate(`/update-product/${productId}`); // Navigate to the update page
  };

  return (
    <div className="container mt-4">
      <h2>Clothes List</h2>
      <div className="row mt-5">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card" style={{ width: '18rem' }}>
              <img
                src={`https://localhost:7006${product.imagePath}`} // Use the URL without additional controller paths
                className="card-img-top"
                alt={product.productName}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
              />
              <div className="card-body">
                <h5 className="card-title">{product.productName}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text"><strong>Price: ${product.price}</strong></p>
                <div className="d-flex justify-content-between mt-3">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleUpdate(product.id)} // Function to handle update
                  >
                    Update
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(product.id)} // Function to handle delete
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alldata;
