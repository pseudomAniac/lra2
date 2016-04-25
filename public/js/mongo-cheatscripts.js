db.articles.update({title: {$regex: /(PNG Loop)/}},{$set: {author: "Loop PNG"}}, {multi: true})
db.articles.update({title: {$regex: /(Loop Weather)/}},{$set: {author: "Press Release - NWS"}}, {multi: true})
