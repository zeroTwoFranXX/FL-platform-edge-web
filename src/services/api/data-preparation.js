import { request } from '../request'

// 创建，编辑数据集(边缘节点)
export const CreateOrEditDataset = (data) => {
    return request ({
        url: '/api/edge/createDataset',
        method: 'POST',
        data
    })
}

//  CSV文件上传(边缘节点)
export const UploadFile = (data) => {
    return request({
        url: '/api/edge/uploadDataset',
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}

// 中央数据注册(边缘节点)
export const RegisterCenData = (datasetId) => {
    return request ({
        url: `/api/edge/registerToCenterDataset/${datasetId}`,
        method: 'POST',
    })
}

// 列表查询(边缘节点)
export const GetList = (data) => {
    return request ({
        url: '/api/edge/getEdgeDatasetList',
        method: 'POST',
        data
    })
}

//删除数据集
export const DelDataset = (datasetId) => {
    return request ({
        url:`/api/edge/deleteDatasetById/${datasetId}`,
        method: 'POST',
    })
}

//获取元数据列表
export const GetMetadata = (data) => {
    return request ({
        url: '/api/metadata/getMetadataPaging',
        method: 'POST',
        data
    })
}

//根据元数据标识修改备注字段
export const UpdateNote = (data) => {
    return request ({
        url: '/api/metadata/updateMetadataById',
        method: 'POST',
        data
    })
}
