import React from 'react';
import { Card, Checkbox, Form, Space } from 'antd';
import { Page } from 'renderer/component';
import { useIpcRenders, useStore } from 'renderer/hooks/useIpcRenders';
import InputSider from './components/InputSider';
import './style/index.less';

const Settings = () => {
    const { getPetSettings } = useStore();

    const { setMainWindowSize, getClickThrough, setClickThrough, getAutoStart, setAutoStart } = useIpcRenders();

    const defaultSettings = getPetSettings();

    return (
        <Page title='设置'>
            <Form
                className='setting-card'
                wrapperCol={{ span: 17 }}
                labelCol={{ span: 4 }}
            >
                <Space
                    direction='vertical'
                    style={{ width: '100%', paddingTop: 10 }}
                >
                    <Card title='窗口设置'>
                        <Form.Item
                            name='size'
                            label='桌宠尺寸'
                            initialValue={defaultSettings.height || 150}
                        >
                            <InputSider
                                min={150}
                                max={500}
                                onChange={value => {
                                    const size = value || 150;
                                    setMainWindowSize(size, size);
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            name='clickThrough'
                            label='点击穿透'
                            initialValue={getClickThrough() || false}
                            valuePropName='checked'
                        >
                            <Checkbox 
                                onChange={e => {
                                    setClickThrough(e.target.checked);
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            name='autoStart'
                            label='开机自启'
                            initialValue={getAutoStart() || false}
                            valuePropName='checked'
                            style={{ marginBottom: 0 }}
                        >
                            <Checkbox 
                                onChange={e => {
                                    setAutoStart(e.target.checked);
                                }}
                            />
                        </Form.Item>
                    </Card>
                </Space>
            </Form>
        </Page>
    );
};

export default Settings;