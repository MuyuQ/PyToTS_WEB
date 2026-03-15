// Bookmarks page script
(function() {
  // 定义标题映射
  var titleMap = {
    '/paths/foundation/variables': '变量与数据类型',
    '/paths/foundation/control-flow': '控制流',
    '/paths/foundation/functions-basics': '函数基础',
    '/paths/foundation/data-structures': '数据结构',
    '/paths/foundation/classes-objects': '类与对象',
    '/paths/migration/types': '类型系统',
    '/paths/migration/functions': '函数进阶',
    '/paths/migration/async': '异步编程',
    '/paths/migration/modules': '模块系统',
    '/paths/advanced/generics': '泛型',
    '/paths/advanced/type-guards': '类型守卫',
    '/paths/advanced/decorators': '装饰器',
    '/paths/advanced/design-patterns': '设计模式',
    '/algorithms/two-sum': '两数之和',
    '/algorithms/binary-search': '二分查找',
    '/algorithms/3sum': '三数之和',
    '/algorithms/merge-intervals': '合并区间',
    '/algorithms/valid-parentheses': '有效的括号',
    '/algorithms/longest-substring-without-repeating': '无重复字符的最长子串',
    '/algorithms/container-with-most-water': '盛最多水的容器',
    '/algorithms/maximum-subarray': '最大子数组和',
    '/algorithms/linked-list-cycle': '环形链表',
    '/algorithms/reverse-linked-list': '反转链表',
    '/algorithms/climbing-stairs': '爬楼梯',
    '/algorithms/house-robber': '打家劫舍',
    '/algorithms/coin-change': '零钱兑换',
    '/algorithms/longest-increasing-subsequence': '最长递增子序列',
    '/algorithms/edit-distance': '编辑距离',
    '/algorithms/word-break': '单词拆分',
    '/algorithms/decode-ways': '解码方法',
    '/algorithms/partition-equal-subset-sum': '分割等和子集',
    '/algorithms/number-of-islands': '岛屿数量',
    '/algorithms/rotting-oranges': '腐烂的橘子',
    '/algorithms/course-schedule': '课程表',
    '/algorithms/word-search': '单词搜索',
    '/algorithms/lru-cache': 'LRU 缓存',
    '/algorithms/find-median-from-data-stream': '数据流的中位数',
    '/algorithms/binary-tree-inorder-traversal': '二叉树的中序遍历',
    '/algorithms/validate-bst': '验证二叉搜索树',
    '/algorithms/clone-graph': '克隆图',
    '/algorithms/longest-common-subsequence': '最长公共子序列',
    '/algorithms/merge-k-sorted-lists': '合并K个升序链表'
  };

  function getCategory(path) {
    if (path.indexOf('/paths/foundation') === 0) return '基础语法';
    if (path.indexOf('/paths/migration') === 0) return '迁移指南';
    if (path.indexOf('/paths/advanced') === 0) return '高级特性';
    if (path.indexOf('/algorithms') === 0) return '算法';
    return '其他';
  }

  function getBookmarks() {
    try {
      var data = localStorage.getItem('ts-py-learning-progress');
      if (data) {
        var parsed = JSON.parse(data);
        return parsed.bookmarks || [];
      }
    } catch (e) {
      console.error('Failed to load bookmarks:', e);
    }
    return [];
  }

  function getCompletedLessons() {
    try {
      var data = localStorage.getItem('ts-py-learning-progress');
      if (data) {
        var parsed = JSON.parse(data);
        var lessons = parsed.lessons || [];
        var map = {};
        for (var i = 0; i < lessons.length; i++) {
          map[lessons[i].path] = true;
        }
        return map;
      }
    } catch (e) {
      console.error('Failed to load lessons:', e);
    }
    return {};
  }

  function renderBookmarks() {
    var container = document.getElementById('bookmarks-container');
    if (!container) return;

    var bookmarks = getBookmarks();
    var completed = getCompletedLessons();

    if (bookmarks.length === 0) {
      container.innerHTML = '<p class="empty-state">暂无书签，在学习过程中点击书签图标添加收藏。</p>';
      return;
    }

    // 按类别分组
    var grouped = {};
    for (var i = 0; i < bookmarks.length; i++) {
      var path = bookmarks[i];
      var category = getCategory(path);
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(path);
    }

    var html = '';
    for (var category in grouped) {
      var paths = grouped[category];
      html += '<h2>' + category + '</h2>';
      html += '<div class="bookmarks-grid">';
      for (var j = 0; j < paths.length; j++) {
        var path = paths[j];
        var title = titleMap[path] || path;
        var isCompleted = completed[path];
        html += '<a href="' + path + '" class="bookmark-card">';
        html += '<div class="bookmark-header">';
        html += '<span class="bookmark-title">' + title + '</span>';
        if (isCompleted) {
          html += '<span class="completed-badge">已完成</span>';
        }
        html += '</div>';
        html += '<div class="bookmark-path">' + path + '</div>';
        html += '</a>';
      }
      html += '</div>';
    }

    container.innerHTML = html;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderBookmarks);
  } else {
    renderBookmarks();
  }
})();
