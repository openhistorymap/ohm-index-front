import { Component, Injectable, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject } from 'rxjs';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { OhmIndexService } from '../ohm-index.service';
import { TreelabelPipe } from '../shared/treelabel.pipe';
import { AreadisplayComponent } from '../areadisplay/areadisplay.component';

export class TopicNode {
  children!: TopicNode[];
  item!: string;
}

export class TopicFlatNode {
  item!: string;
  level!: number;
  expandable!: boolean;
}

@Injectable()
export class TopicTreeDatabase {
  dataChange = new BehaviorSubject<TopicNode[]>([]);

  get data(): TopicNode[] {
    return this.dataChange.value;
  }

  initialize(treeData: any) {
    this.dataChange.next(this.buildFileTree(treeData, 0));
  }

  buildFileTree(obj: { [key: string]: any }, level: number): TopicNode[] {
    return Object.keys(obj).reduce<TopicNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TopicNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTreeModule,
    MatExpansionModule,
    MatChipsModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    TreelabelPipe,
    AreadisplayComponent,
  ],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [TopicTreeDatabase],
})
export class IndexComponent implements OnInit {
  flatNodeMap = new Map<TopicFlatNode, TopicNode>();
  nestedNodeMap = new Map<TopicNode, TopicFlatNode>();
  selectedParent: TopicFlatNode | null = null;

  treeControl: FlatTreeControl<TopicFlatNode>;
  treeFlattener: MatTreeFlattener<TopicNode, TopicFlatNode>;
  dataSource: MatTreeFlatDataSource<TopicNode, TopicFlatNode>;
  checklistSelection = new SelectionModel<TopicFlatNode>(true);

  out: any;
  indices: any;
  selected: TopicFlatNode[] = [];
  spaceFilter: string[][] | null = null;

  private ohm = inject(OhmIndexService);
  private database = inject(TopicTreeDatabase);

  constructor() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<TopicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });

    this.checklistSelection.changed.subscribe(data => {
      this.selected.push(...data.added);
      data.removed.forEach(x => {
        const c = this.selected.indexOf(x);
        if (c > -1) {
          this.selected.splice(c, 1);
        }
      });
    });
  }

  getLevel = (node: TopicFlatNode) => node.level;
  isExpandable = (node: TopicFlatNode) => node.expandable;
  getChildren = (node: TopicNode): TopicNode[] => node.children;
  hasChild = (_: number, n: TopicFlatNode) => n.expandable;
  hasNoContent = (_: number, n: TopicFlatNode) => n.item === '';

  ngOnInit(): void {
    this.ohm.getIndices().subscribe((indices: any) => {
      this.indices = indices;
      this.ohm.getIndex().subscribe((data: any) => {
        this.out = data;
      });
      this.database.initialize(this.indices.trees);
    });
  }

  get topics(): string[] {
    return Object.keys(this.indices.topics);
  }

  getIndex(y: any, t: string) {
    return this.out.filter(
      (x: any) => x.interval[0] === y[0] && x.interval[1] === y[1] && x.topic === t,
    )[0].available;
  }

  iconFor(t: string) {
    return this.ohm.iconFor(t);
  }

  topicLabel(t: string) {
    return t.split(':').join(' ');
  }

  getReference(t: string) {
    return Object.keys(this.indices.topics[t]);
  }

  getFound(y: any, t: string) {
    return this.out.filter(
      (x: any) => x.interval[0] === y[0] && x.interval[1] === y[1] && x.topic === t,
    )[0].subs;
  }

  transformer = (node: TopicNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item ? existingNode : new TopicFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  descendantsAllSelected(node: TopicFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return (
      descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child))
    );
  }

  descendantsPartiallySelected(node: TopicFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  todoItemSelectionToggle(node: TopicFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  todoLeafItemSelectionToggle(node: TopicFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: TopicFlatNode): void {
    let parent: TopicFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: TopicFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: TopicFlatNode): TopicFlatNode | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  applySpaceFilter() {
    if (this.selected.length === 0 || this.selected.filter(x => x.level === 0).length === 1) {
      this.spaceFilter = null;
    } else {
      this.spaceFilter = [this.selected.map(x => x.item)];
    }
    this.ohm.getIndex(this.spaceFilter).subscribe((data: any) => {
      this.out = data;
    });
  }
}
