import '../assets/css/ProductDescription.css';

const ProductDescription = ({ title, description }) => {
    
    return (
        <div className="product-description-container">
            <h2 className="product-description-title">{title}</h2>
            <p className="product-description-text">
                {description}
            </p>
        </div>
    );
};

export default ProductDescription;