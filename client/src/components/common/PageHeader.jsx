import { Card } from 'react-bootstrap';

function PageHeader({ title, icon = '', className = '' }) {
    return (
<Card className={`mb-2 shadow-sm border-start border-4 border-secondary bg-light ${className}`}>

            <Card.Body>
                <h2 className="mb-0">{icon && `${icon} `}{title}</h2>
            </Card.Body>
        </Card>
    );
}

export default PageHeader;
