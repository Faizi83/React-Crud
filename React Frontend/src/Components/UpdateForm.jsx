import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateForm = () => {
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    description: '',
    image: null,
    imagePath: '',
    imagePreview: '' // Add this state for image preview
  });
  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`https://localhost:7006/api/working/get-product/${productId}`);
          setFormData({
            productName: response.data.productName,
            price: response.data.price,
            description: response.data.description,
            image: null,
            imagePath: response.data.imagePath,
            imagePreview: '' // Initialize image preview to empty
          });
        } catch (error) {
          console.error('Error fetching product', error);
        }
      };
      fetchProduct();
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setFormData({ ...formData, image: file });

      // Generate the image preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prevFormData => ({
            ...prevFormData,
            imagePreview: reader.result // Update imagePreview with the data URL
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setFormData(prevFormData => ({
          ...prevFormData,
          imagePreview: '' // Reset the preview if no file is selected
        }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/data');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('productName', formData.productName);
    data.append('price', formData.price);
    data.append('description', formData.description);

    // Append image only if a new image is selected
    if (formData.image) {
      data.append('image', formData.image);
    }

    // Always append imagePath
    data.append('imagePath', formData.imagePath);

    try {
      await axios.put(`https://localhost:7006/api/working/update-product/${productId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Product updated successfully');
      navigate('/data');
    } catch (error) {
      console.error('Error updating product', error);
      alert('Error updating product');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update Clothes</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        {formData.imagePath && !formData.imagePreview && (
          <div className="mb-3">
       
            <img
              src={`https://localhost:7006${formData.imagePath}`}
              alt="Existing product"
              className="img-thumbnail"
              style={{ maxHeight: '200px' }}
            />
          </div>
        )}
        {formData.imagePreview && (
          <div className="mb-3">
            <img
              src={formData.imagePreview}
              alt="New product preview"
              className="img-thumbnail"
              style={{ maxHeight: '200px' }}
            />
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Update Image (Optional)</label>
          <input
            type="file"
            className="form-control"
            name="image"
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
        <button type="button" className="btn btn-danger mx-3" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default UpdateForm;
