"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const antd_1 = require("antd");
const modal_module_css_1 = __importDefault(require("../styles/modal.module.css"));
function PopupModal({ 
// @ts-ignore
open, 
// @ts-ignore
closeModal, 
// @ts-ignore
modalWidth, 
// @ts-ignore
text, 
// @ts-ignore
buttonText, 
// @ts-ignore
iconPath, 
// @ts-ignore
customIconWidth, 
// @ts-ignore
customDiv, 
// @ts-ignore
// @ts-ignore
closableM, 
// @ts-ignore
buttonClick, 
// @ts-ignore
textAlign, }) {
    return (<antd_1.Modal centered width={modalWidth ? modalWidth : 378} title={null} onCancel={closeModal} open={open} footer={null} closable={false}>
      <antd_1.Row justify="center" gutter={[0, 30]} className="py-[20px]">
        <antd_1.Col span={24}>
          <antd_1.Row justify="center">
            {iconPath && (<antd_1.Image width={customIconWidth ? customIconWidth : 180} height={44} src={`${iconPath}.svg`} preview={false} alt="Header Logo"/>)}
          </antd_1.Row>
        </antd_1.Col>

        {customDiv && (<antd_1.Col span={24}>
            <antd_1.Row justify="center">{customDiv}</antd_1.Row>
          </antd_1.Col>)}

        {text && text}
        <antd_1.Col span={18}>
          <antd_1.Col span={20} style={{ margin: "0 auto" }}>
            {buttonText && (<antd_1.Button type="primary" className={modal_module_css_1.default["modal-button"]} onClick={buttonClick}>
                {buttonText}
              </antd_1.Button>)}
          </antd_1.Col>
        </antd_1.Col>
      </antd_1.Row>
    </antd_1.Modal>);
}
exports.default = PopupModal;
