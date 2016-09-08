db.getCollection('clients').find({$and: [{$or: [{'name': {$regex: /^c/i}}, {'ap1': {$regex: /^c/i}}, {'ap2': {$regex: /^c/i}}]},
                                           {'clientType.idType': {$in: [1,2]}}]})
                                                