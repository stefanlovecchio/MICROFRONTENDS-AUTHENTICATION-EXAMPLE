// product-app/src/ProductComponent.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Button, Form, Container, ListGroup, Alert } from 'react-bootstrap';

const GET_PRODUCTS_QUERY = gql`
  query GetProducts {
    products {
      id
      productName
      productDescription
    }
  }
`;
//
const ADD_PRODUCT_MUTATION = gql`
  mutation AddProduct($productName: String!, $productDescription: String!) {
    addProduct(productName: $productName, productDescription: $productDescription) {
        id
        productName
        productDescription
      }
    }
  `;
  
  function ProductComponent() {
      const { loading, error, data } = useQuery(GET_PRODUCTS_QUERY, {
          context: { credentials: 'include' },
      });
  
      const [addProduct, { loading: adding }] = useMutation(ADD_PRODUCT_MUTATION, {
          refetchQueries: [GET_PRODUCTS_QUERY],
      });
  
      const [productName, setProductName] = useState('');
      const [productDescription, setProductDescription] = useState('');
  
      const handleSubmit = async (e) => {
          e.preventDefault();
          if (!productName.trim() || !productDescription.trim()) return;
          await addProduct({ variables: { productName, productDescription } });
          setProductName('');
          setProductDescription('');
      };
  
      if (loading) return <p>Loading...</p>;
      if (error) return <Alert variant="danger">Error :( Please make sure you're logged in.</Alert>;
  
      return (
          <Container>
              <h2>Add a New Product</h2>
              <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                      <Form.Label>Product Name</Form.Label>
                      <Form.Control
                          type="text"
                          placeholder="Enter product name"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                      />
                  </Form.Group>
                  <Form.Group className="mb-3">
                  <Form.Label>Product Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter product description"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={adding}>
                    Add Product
                </Button>
            </Form>

            <h3 className="mt-4">Product List</h3>
            <ListGroup>
                {data && data.products.map(({ id, productName, productDescription }) => (
                    <ListGroup.Item key={id}>
                        <strong>{productName}</strong>: {productDescription}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
}

export default ProductComponent;
