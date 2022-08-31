//生成指定数目和范围的随机数[0,max)
///////////////创造随机数的函数io，输入（需要数的数量，总数数量），输出（随机生成数组）（这里面的数唯一）[0,allnum)范围.
function choosedistinctrandom(max, countNum) {
    let arr = [];
    // 在此处补全代码
    for(let i=0;i<countNum;i++){
      var number= Math.floor(Math.random() * max ); 
      if(arr.indexOf(number)==-1){ //去除重复项
        arr.push(number);
      }else{
          i--;
    }
   
  }
   return arr;
  }
  
  /////////////////////////////////////////////////////////////
  
  ///////////////创造随机数的函数io，输入（需要数的数量，总数数量），输出（随机生成数组）（这里面的数可能会重复）[0,allnum)范围.
  /////////用于取数组中的值
  function createRandom(num, allnum) {
      let res = [];
      for (let i = 0; i < num; ++i) {
          let randnum = Math.floor(Math.random() * (allnum));
          res.push(randnum);
  
  
      }
      return res;
  
  
  }
  
  
  ///////////////////////////////////////////////////////////////////
  ///////////////创造随机数的函数io，输入（需要数的数量，总数数量），输出（随机生成数组）（这里面的数可能会重复）[1,allnum]范围.
  //////////////////用于records中的index随机
  function createRandomindex(num,allnum)
  {
       let res = [];
      for (let i = 0; i < num; ++i) {
          let randnum=Math.floor(Math.random()*(allnum)+1);
          res.push(randnum);
  
  
      }
      return res;
  }
  
  
  /////////实现数组的浅拷贝，也是作为辅助使用
  function arraycopy(copyarray) {
  
      let i = -1;
      let resarray = new Array;
      while (++i < copyarray.length) {
          resarray[i] = copyarray[i];
      }
      return resarray
  }
  ////////////////////////////////////////////
  
  ////////数组相减io，输入为（减数，被减数），输出为（二者相减生成的数组）
  function arraydelete(val1, val2) {
      let useval1 = arraycopy(val1);
  
      let useval2 = arraycopy(val2);
      for (var i = useval1.length - 1; i >= 0; i--) {
          let a = useval1[i];
          for (var j = useval2.length - 1; j >= 0; j--) {
              let b = useval2[j];
              if (a == b) {
                  useval1.splice(i, 1);
                  useval2.splice(j, 1);
                  break;
              }
          }
      }
      return useval1;
  }
  ////////////////////////////////////////////////////////
  
  
  ///////////////实现根据type以及月份数据来找到需求的值
  function GetrequestNum(month, typename) {
      for (let record of queryinput2.records) {
          if (record.getCellValue("MOIS") == month) {
  
              switch (typename) {
                  case "HomePage":
                      return record.getCellValue("LIEN HOME(系数0-4-0.6之间随机）");
                      break;
                  case "Produit":
                      return record.getCellValue("LIEN PRODUIT 剩下的数量");
                      break;
  
  
                  case "Collection":
                      return record.getCellValue("LIEN COLLECTION（系数0.3-0.4随机）");
                      break;
                  default:
                      return 0;
              }
          }
  
      }
      return 0;
  }
  /////////////////////////////////////////////////////////////
  
  /////settings 
  let settings = input.config({
      title: '生成随机数',
      description: "填入月份，选择想要参照的列以及生成数据的列（需要提前创建），然后点击运行即可生成随机的锚词。 "
      ,
  
      items: [
          input.config.text('month',
              { description: "填入需求月份，记住要全大写" }),
          input.config.text('sumcollection',
              { description: "填入总共collection的sku数" }),
          input.config.table('table', { label: '生成随机数所在的表' }),
          input.config.field('prefield', {
              parentTable: 'table',
              label: '参照的列',
          }),
          input.config.field('reqfield', {
              parentTable: 'table',
              label: '生成的列',
          }),
  
      ],
  });
  let { table, month, prefield, reqfield, sumcollection } = settings;
  
  //////////////////////////////////////////////////////////////
  
  
  
  let tablein = base.getTable("月度外链计划计算表")
  console.log(month)
  console.log(reqfield.name)
  let tablenow = table;
  
  
  let queryinput2 = await tablein.selectRecordsAsync();
  console.log("开始执行");
  let reqHome = Number(GetrequestNum(month, "HomePage"));
  let reqProduit = Number(GetrequestNum(month, "Produit"));
  let reqCollection = Number(GetrequestNum(month, "Collection"));
  /////////console.log(reqHome);console.log(reqCollection);
  ///////////////console.log(reqProduit);
  ///////读取功能实现
  
  
  
  ///////////////////////已经实现。homepage
  ////////////homepage只有一个所以直接做
  //////////////////////////
  let homepageview = tablenow.getView("主页");
  let homepagequery = await homepageview.selectRecordsAsync();
  
  ////////////homepage只有一个所以直接做
  for (let record of homepagequery.records) {
      let keywordsdata = record.getCellValue("关键词映射");
      if (keywordsdata != null) {
  
          reqHome = Number(reqHome);
          console.log("需要生成" + reqHome + "个数");
  
          //////生成字符串对应的数组
          let keywordsarray = new Array();
              keywordsarray = keywordsdata.split(", ");///使用split转换为数组
  
              console.log("开始随机")
              ///生成homepage对应的随机数组
              let randindex = createRandom(reqHome, keywordsarray.length);
              let resstring = "";
              //先把第一个加进去，后面的用for循环统一加
              if (randindex.length > 0) {
                  resstring += keywordsarray[randindex[0]];
              }
              for (let i = 1; i < randindex.length; ++i) {
                  resstring += ", " + keywordsarray[randindex[i]];
  
              }
  
              ///准备写入列中
              await tablenow.updateRecordAsync(record, { [reqfield.name]: resstring });
              console.log("success")
          }
  
          
      }
  //////////////////////////
  //////////////////////////
  //////////////////////////
  //////////////////////////
  
  
  
  /////////homepage做完，开始做Collection页面
  //////////////////////////////////////////////////
  
  let collectionview = tablenow.getView("collection");
  let collectionquery = await collectionview.selectRecordsAsync();
  console.log("需要生成" + reqCollection + "个数");
  //////////随机生成我们所要取的行数[1,sum]
  let collectionindex = createRandomindex(reqCollection, sumcollection)
  //////collection类目的当前行数量
  let collectionligne = 1;
  console.log(collectionindex);
  
  //此时进行循环，对于每一列，我们统计他们在其中随机到的次数然后再进行分配关键词
  for (let record of collectionquery.records) {
      let count = 0;
      /////////使用count来统计它被用到的总数
      for (let i = 0; i < collectionindex.length; ++i) {
          if (collectionindex[i] == collectionligne) {
              count++;
          }
  
      }
      console.log(count);
      //////这样就得到了一个总数
      /////////然后开始进行随机分配
      let keywordsdata = record.getCellValue("关键词映射");
      //非空且要取
      if (keywordsdata != null && count > 0) {
          //////生成字符串对应的数组
          let keywordsarray = new Array();
          keywordsarray = keywordsdata.split(", ");///使用split转换为数组
  
          console.log("开始随机")
          ///生成homepage对应的随机数组
          let randindex = createRandom(count, keywordsarray.length);
          let resstring = "";
          //先把第一个加进去，后面的用for循环统一加
          if (randindex.length > 0) {
              resstring += keywordsarray[randindex[0]];
          }
          for (let i = 1; i < randindex.length; ++i) {
              resstring += ", " + keywordsarray[randindex[i]];
  
          }
  
          ///准备写入列中
          await tablenow.updateRecordAsync(record, { [reqfield.name]: resstring });
          console.log("success")
  
  
      }
  
      collectionligne++;
      console.log("完成一行")
  
  }
  ////////////////collection页面完成
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  //////////////////接下来做产品页面
  /////////////////////////////////////////////
  //////////产品界面就要考虑上次选择的sku了
  ///////思路：1.先读取到需要的总数
  ////////2.进行初次分配，首先查找上一次使用的数据所在的行数，生成一个数组。先把总数组减去它，就得到了新的需要搜索的行数数组。
  /////////////对老的进行处理，之前的数组长度*0.8 取上得到要从中取的数。
  /////////然后用不重复随机来在老行数中取出，得到我们需要的不重复的行数。
  ////然后将总的
  
  
  /////此时显示的页面应该是已完成的产品页面
  let productview = tablenow.getView("产品");
  let productquery = await productview.selectRecordsAsync();
  console.log("需要生成" + reqProduit + "个产品外链");
  let reqProduitdis=Math.floor(Math.random()*(reqProduit/2)+reqProduit/2);
  console.log("需要生成" + reqProduitdis + "个独立的产品外链");
  /////预定义之前做过的列表
  let preindexarr=[];
  ///////////总列表，用于数组减法
  let allnumarray=[];
  let userecord=1
  for(let record of productquery.records )
  {   
      let preindex=record.getCellValue(prefield);
     ///////通过用它-1是否为-1来判断是不是空的
      if(preindex[0]-1!=-1){ 
  
          preindexarr.push(userecord);
  
  
      }
      allnumarray.push(userecord);
      userecord++
  }
  ////////////////前面使用过的产品的页码数组
  console.log(preindexarr)
  
  
  ////////产品列表中产品总数
  let sumproduit=userecord-1;
  
  ///////知道产品用过的产品列表以后，我们先可以从中取得我们需要的行数【随机不同的82开】
  let alreadyusesum = preindexarr.length;
  let choosereqsum=Math.floor(0.8*alreadyusesum)      ///在以往的链接中取的链接的数量
  console.log("需要生成" + choosereqsum+ "个独立的以前的产品外链");
  let choosereqsum2=reqProduitdis-choosereqsum;
  console.log("需要生成" + choosereqsum2+ "个独立的新的产品外链");
  ///////console.log(choosereqsum);
  ///行号，从一开始console.log(allnumarray);
  
  ////先把以前产品中选取的列搞出来
  /////////////////////////////////////
  ///////预定义结果列
  let chooseres=[];
  /////////得到之前产品要选外链的索引
  let choosepreindex=choosedistinctrandom(alreadyusesum,choosereqsum);
  //////////////console.log(choosepreindex);
  ///////插到数组中得到在以前选取的列
  for(let i =0;i<choosepreindex.length;++i)
  {
      chooseres.push(preindexarr[choosepreindex[i]]);
  
  }
  /////////////////choosepreres就是我们在之前中选出的不重复列。
  console.log(chooseres);
  
  ///////现在我们在之前没选的列中选不重复列
  
  let nowdisarrayall=arraydelete(allnumarray,preindexarr)
  //////////////console.log(nowdisarrayall);
  let choosenowindex=choosedistinctrandom(nowdisarrayall.length,choosereqsum2);
  ///////同样的方法选出来
  for(let i =0;i<choosenowindex.length;++i)
  {
      chooseres.push(nowdisarrayall[choosenowindex[i]]);
  
  }
  
  console.log("分析出的独立sku行号"+chooseres);
  ///////////////////////////
  ///////////////需要的独立外链的列表已经准备好了
  ////////现在就是进行分配了
  let restnum=reqProduit-reqProduitdis;
  ///////剩的数目数量，我们再将它分配过去
  ////////////0到其长度间选择索引
  let restarray=createRandom(restnum,chooseres.length)
  console.log(restarray)
  ///再用老办法push进去
  for(let i=0;i<restarray.length;++i)
  {
      chooseres.push(chooseres[restarray[i]])
  
  }
  console.log(chooseres)
  
  ///////////////终于到最后一步了！！！通过独立行号来进行判断
  let productligne =1;
  
  for(let record of productquery.records)
  {
      let count=0;
      for (let i = 0; i < chooseres.length; ++i) {
          if (chooseres[i] == productligne) {
              count++;
          }
  
      }
      console.log(count);
          //////这样就得到了一个总数
      /////////然后开始进行随机分配
      let keywordsdata = record.getCellValue("关键词映射");
        //非空且要取
      if (keywordsdata != null && count > 0) {
          //////生成字符串对应的数组
          let keywordsarray = new Array();
          keywordsarray = keywordsdata.split(", ");///使用split转换为数组
  
          console.log("开始随机")
          ///生成homepage对应的随机数组
          let randindex = createRandom(count, keywordsarray.length);
          let resstring = "";
          //先把第一个加进去，后面的用for循环统一加
          if (randindex.length > 0) {
              resstring += keywordsarray[randindex[0]];
          }
          for (let i = 1; i < randindex.length; ++i) {
              resstring += ", " + keywordsarray[randindex[i]];
  
          }
  
          ///准备写入列中
          await tablenow.updateRecordAsync(record, { [reqfield.name]: resstring });
          console.log("success产品")
  
  
      }
  
      productligne++;
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  