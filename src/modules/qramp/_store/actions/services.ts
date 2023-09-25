/* Importing the baseService, qRampStore, and Vue. */
import baseService from "@imagina/qcrud/_services/baseService.js";
import qRampStore from "../qRampStore.js";
import Vue from 'vue';
import {
    BUSINESS_UNIT_PASSENGER, 
    BUSINESS_UNIT_RAMP,
    COMPANY_PASSENGER,
    COMPANY_RAMP,
} from '../../_components/model/constants.js';
import pluginsArray from '@imagina/qsite/_plugins/array.js';

/* A model for the service list. */
export const serviceListModel = {
    id: 0,
    title: "",
    dynamicField: [],
};
/**
 * It makes a request to the server, and returns the response data.
 * @returns An array of categories.
 */
export const getCategories = async (): Promise<any[]> => {
    try {
        const isPassenger = qRampStore().getIsPassenger();
        const companyId = isPassenger ? COMPANY_PASSENGER : COMPANY_RAMP; 
        let requestParams = {
            params: {
                include:
                    "products,products.attributes,products,products.attributes.values",
                filter: {
                    companyId,
                }    
            },
        };
        const response = await baseService.index(
            "apiRoutes.qramp.categories",
            requestParams
        );
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
};

/**
 * It takes a list of categories, and for each category, it checks if the products are a list or a
 * dynamic field, and returns a new list of categories with the dynamic field added to each category.
 * @returns An array of objects.
 */
export async function buildServiceList(): Promise<any[]> {
    try {
        const categories = await getCategories();
        const categoryList = categories.length > 0 ? pluginsArray.tree(categories): [];
        const build = categoryList.map((item) => {
            let dynamicField: any = {
                dynamicField: getIfItIsTypeListOrDynamicField(item.products),
            };
            dynamicField = dynamicField.dynamicField.length === 0 ? {} : dynamicField;
            let lists = {};
            if(item.children && item.children.length > 0) {
                lists = item.children.map(item => {
                    let dynamicFieldChildren: any = {
                        dynamicField: getIfItIsTypeListOrDynamicField(item.products),
                    };
                    return {
                        id: item.id,
                        title: item.name,
                        ...dynamicFieldChildren
                    };
                })
                lists = { lists }
            }
            return {
                id: item.id,
                title: item.name,
                ...dynamicField,
                ...lists,
            };
        });
        return build;
    } catch (error) {
        console.log(error);
        return [];
    }
}

/**
 * It takes a list of products, and returns a list of dynamic fields.
 * @param product - 
 * @returns [
 *   {
 *     "icon": "settings",
 *     "id": "5e8f8f8f8f8f8f8f8f8f8f8f",
 *     "categoryId": "5e8f8f8f8f8f8f8f8f8f8f8f",
 *     "
 */
export const getIfItIsTypeListOrDynamicField = (product) => {
    try {
        const data: any = [];
        const dynamicFieldModel: any = {
            icon: "settings",
        };
        const organizeProduct = organizeProducts(product);
        organizeProduct.forEach((product) => {
            dynamicFieldModel.id = product.id;
            dynamicFieldModel.categoryId = product.categoryId;
            dynamicFieldModel.title = product.name;
            dynamicFieldModel.formField = getDynamicField(product.attributes);
            data.push({ ...dynamicFieldModel });
        });
        return data;
    } catch (error) {
        console.log(error);
    }
};

/**
 * It takes an array of objects, and returns an object with the same keys as the array, but with the
 * values of the array replaced with the values of the object.
 * @param attributes
 * @returns {dynamicField}
 *  
 */
function getDynamicField(attributes) {
    try {
        const result = {};
        for (let i = 0; i < attributes.length; i++) {
            const currentValue = attributes[i];
            const props = setProps(
            currentValue.type,
            currentValue.name,
            currentValue.values,
            i
            );
            const key = `${currentValue.type}${currentValue.name ? currentValue.name : ""}`;
            const type = currentValue.type === "quantityFloat" ? "quantity" : currentValue.type;

            result[key] = {
            name: currentValue.name,
            value: currentValue.value ? currentValue.value : null,
            type,
            id: currentValue.id,
            props: { ...props },
            };
        }

        return result;
    } catch (error) {
        console.log(error);
    }
}

/**
 * It takes in a type, name, options, and index and returns an object with a readonly property and a
 * mask property.
 * @param type - "quantity | select | fullDate | quantityFloat"
 * @param name,
 * @param options - [{name: "", value: ""}]
 * @param index
 * @returns {PropsDynamicField}
 */
function setProps(type, name, options, index) {
    const readonly = qRampStore().disabledReadonly();
    if (type == "quantity") {
        return {
            readonly,
            mask: "###################",
        };
    }
    if (type == "select") {
        return {
            readonly,
            label: name,
            options: options.map((item) => {
                item.label = item.name;
                return item;
            }),
            type,
        };
    }
    if (type == "fullDate") {
        return {
            readonly,
            label: name,
            hint: "Format: MM/DD/YYYY HH:mm",
            mask: "MM/DD/YYYY HH:mm",
            "place-holder": "MM/DD/YYYY HH:mm",
            format24h: true,
        };
    }
    if (type === "quantityFloat") {
        return {
            readonly,
            type: "number",
            step: "0.1",
        };
    }
    return {
        readonly,
        label: name,
    };
}

/**
 * It takes an array of objects, and returns an array of objects, where each object has a key of
 * "value" and a value of true.
 * @param data
 * @returns [
 *   {
 *     "name": "Service 1",
 *     "value": "Service 1"
 *   },
 *   {
 *     "name": "Service 2",
 *     "value": "Service 2"
 *   },
 *   {
 *     "name": "Service 3",
 *     "value": "Service 3"
 *   }
 * ]
 */
export function getListOfSelectedServices(data) {
    try {
        const service = Vue.prototype.$clone(data.filter((items) => {
            for (let item in items.formField) {
                for (let key in items.formField[item]) {
                    if (key == "value") {
                        return items.formField[item][key];
                    }
                }
            }
        }));
        return productDataTransformation(service) || [];
    } catch (error) {
        console.log(error);
    }
}
/**
 * If the productData array has a length greater than 0, then map over the data array and return a new
 * array with the product objects that have been updated with the values from the productData array.
 * @param {any} data - any =&gt; this is the data that is being mapped.
 * @returns The data is being returned as an array of objects.
 */
function organizeProducts(data: any) {
    const productData = qRampStore().getWorkOrderItems();
    if (productData.length > 0) {
        return data.map((product) => {
            (productData as any).map((sw) => {
                if (sw.productId == product.id) {
                    product.attributes.map((att) => {
                        sw.workOrderItemAttributes.map((swatt) => {
                            if (swatt.attributeId == att.id) {
                                att.value = swatt.value;
                                return swatt;
                            }
                        });
                        return att;
                    });
                }
                return sw;
            });
            return product;
        });
    } else {
        return data;
    }
}

/**
 * It takes an object, loops through it, and returns an array of objects with the key and value of the
 * original object.
 * @param obj
 * @returns An array of objects.
 */
function setAttr(obj) {
    try {
        const att: any = [];
        for (let key in obj) {
            const data = validationDataAttr(obj, key);
            att.push({ ...data });
        }
        return att;
    } catch (error) {
        console.log(error);
    }
}
/**
 * If the object has an id and attributeId, return an object with id, attributeId, name, value, and
 * type. If the object has an id and no attributeId, return an object with id, name, value, type, and
 * attributeId. If the object has an attributeId and value, return an object with attributeId, name,
 * value, and type.
 * @param {any} obj 
 * @param {any} key - the key of the object
 * @returns {
 *   id: 1,
 *   attribute_id: 1,
 *   name: 'name',
 *   value: 'value',
 *   type: 'type',
 * }
 */
function validationDataAttr(obj: any, key: any) {
    let data: any = {
        name: obj[key].name,
        value: obj[key].value,
        type: obj[key].type,
    };
    if (obj[key].id && obj[key].attributeId) {
        data = {
            id: obj[key].id,
            attribute_id: obj[key].attributeId,
            ...data,
        };
    }
    if (obj[key].id && !obj[key].attributeId) {
        data = {
            ...data,
            attribute_id: obj[key].id,
        };
    } else if (obj[key].attributeId && obj[key].value) {
        data = {
            ...data,
            attribute_id: obj[key].attributeId,
        };
    }
    return data;
}
/**
 * It takes an array of objects, and returns an array of objects with the same keys, but with different
 * values.
 * @param data - [{id: 1, formField: [{name: 'name', value: 'value'}]}]
 * @returns [
 *   {
 *     "product_id": "1",
 *     "work_order_item_attributes": [],
 *    }
 * ] 
 */
export function productDataTransformation(data = []) {
    try {
        const products: any = [];
        data.forEach((items: any) => {
            if (items.id || isDelete(items.formField)) {
                products.push({
                    product_id: items.id,
                    work_order_item_attributes: setAttr(items.formField),
                });
            }
        });
        return products;
    } catch (error) {
        console.log(error);
    }
}

/**
 * It returns true if the object has at least one property with a value that is not an empty string.
 * @param obj - the object to be checked
 * @returns An array of objects.
 */
function isDelete(obj) {
    try {
        const att = []
        for (let key in obj) {
            return obj[key].value && obj[key].value != ""
        }
        return att
    } catch (error) {
        console.log(error);
    }
}
