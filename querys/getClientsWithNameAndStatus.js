db.getCollection('clients').find({$and: [{$or: [{'name': {$regex: /^e/i}}, {'ap1': {$regex: /^e/i}}, {'ap2': {$regex: /^e/i}}]},
                                           {'clientType.idType': 2}]})
                                                