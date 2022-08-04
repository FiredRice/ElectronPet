import React from 'react';
import { Col, InputNumber, Row, Slider, SliderSingleProps } from 'antd';

const InputSider: React.FC<SliderSingleProps> = (props) => {
    const { defaultValue, value, onChange, min, max, style, className, ...otherProps } = props;
    return (
        <Row align='middle' className={className} style={style}>
            <Col span={19}>
                <Slider
                    min={150}
                    max={500}
                    defaultValue={defaultValue}
                    value={value}
                    onChange={onChange}
                    {...otherProps}
                />
            </Col>
            <Col span={4} className='mg-l-10'>
                <InputNumber 
                    defaultValue={defaultValue}
                    min={150}
                    max={500}
                    value={value}
                    onChange={onChange}
                />
            </Col>
        </Row>
    );
};

export default InputSider;