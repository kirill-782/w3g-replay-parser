import { AbilityActionConverter } from "./AbilityAction";
import { AbilityTwoTargetTwoItemActionConverter } from "./AbilityTwoTargetTwoItemAction";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "./AbstractActionData";
import { AllyOptionsConverter } from "./AllyOptionsAction";
import { ArrowKeyConverter } from "./ArrowKeyAction";
import { AssignGroupHotkeyConverter } from "./AssignGroupHotkeyAction";
import { CancelHeroRevivalConverter } from "./CancelHeroRevivalAction";
import { ChangeSelectionConverter } from "./ChangeSelectionAction";
import { ChatCommandConverter } from "./ChatCommandAction";
import { DecreaseSpeedConverter } from "./DecreaseSpeedAction";
import { ESCKeyEventConverter } from "./ESCKeyEventAction";
import { IncreaseSpeedConverter } from "./IncreaseSpeedAction";
import { ItemActionConverter } from "./ItemAction";
import { MinimapPingConverter } from "./MinimapPingAction";
import { OpenBuildSubmenuConverter } from "./OpenBuildSubmenuAction";
import { OpenSkillSubmenuConverter } from "./OpenSkillSubmenuAction";
import { PauseGameConverter } from "./PauseGameAction";
import { PositionAbilityActionConverter } from "./PositionAbilityAction";
import { PositionAndObjectAbilityActionConverter } from "./PositionAndObjectAbilityAction";
import { PreSubselectionConverter } from "./PreSubselectionAction";
import { RemoveQueuedUnitConverter } from "./RemoveQueuedUnitAction";
import { ResourceTransferConverter } from "./ResourceTransferAction";
import { ResumeGameConverter } from "./ResumeGameAction";
import { SaveGameConverter } from "./SaveGameAction";
import { SaveGameFinishedConverter } from "./SaveGameFinishedAction";
import { SelectGroudItemConverter } from "./SelectGroudItemAction";
import { SelectGroupHotkeyConverter } from "./SelectGroupHotkeyAction";
import { SelectSubGroupConverter } from "./SelectSubGroupAction";
import { SinglePlayerCheatConverter } from "./SinglePlayerCheatAction";
import { SinglePlayerCheatResourceConverter } from "./SinglePlayerCheatAction/SinglePlayerCheatResourceAction";
import { SinglePlayerCheatTimeConverter } from "./SinglePlayerCheatAction/SinglePlayerCheatTimeAction";
import { SyncIntegerConverter } from "./SyncIntegerAction";
import { Unknown1bConverter } from "./Unknown1bAction";
import { Unknown21Converter } from "./Unknown21Action";
import { Unknown62Converter } from "./Unknown62Action";
import { Unknown69Converter } from "./Unknown69Action";
import { Unknown6aConverter } from "./Unknown6aAction";
import { DataBuffer } from "../DataBuffer";
import { UjSyncConverter } from "./UjSyncAction/index";

const defaultActionHandlers: AbstractActionConverter[] = [];
defaultActionHandlers[PauseGameConverter.type] = new PauseGameConverter();
defaultActionHandlers[ResumeGameConverter.type] = new ResumeGameConverter();
defaultActionHandlers[IncreaseSpeedConverter.type] =
  new IncreaseSpeedConverter();
defaultActionHandlers[DecreaseSpeedConverter.type] =
  new DecreaseSpeedConverter();
defaultActionHandlers[SaveGameConverter.type] = new SaveGameConverter();
defaultActionHandlers[SaveGameFinishedConverter.type] =
  new SaveGameFinishedConverter();
defaultActionHandlers[AbilityActionConverter.type] =
  new AbilityActionConverter();
defaultActionHandlers[PositionAbilityActionConverter.type] =
  new PositionAbilityActionConverter();
defaultActionHandlers[PositionAndObjectAbilityActionConverter.type] =
  new PositionAndObjectAbilityActionConverter();
defaultActionHandlers[ItemActionConverter.type] = new ItemActionConverter();
defaultActionHandlers[AbilityTwoTargetTwoItemActionConverter.type] =
  new AbilityTwoTargetTwoItemActionConverter();
defaultActionHandlers[ChangeSelectionConverter.type] =
  new ChangeSelectionConverter();
defaultActionHandlers[AssignGroupHotkeyConverter.type] =
  new AssignGroupHotkeyConverter();
defaultActionHandlers[SelectGroupHotkeyConverter.type] =
  new SelectGroupHotkeyConverter();
defaultActionHandlers[SelectSubGroupConverter.type] =
  new SelectSubGroupConverter();
defaultActionHandlers[PreSubselectionConverter.type] =
  new PreSubselectionConverter();
defaultActionHandlers[Unknown1bConverter.type] = new Unknown1bConverter();
defaultActionHandlers[SelectGroudItemConverter.type] =
  new SelectGroudItemConverter();
defaultActionHandlers[CancelHeroRevivalConverter.type] =
  new CancelHeroRevivalConverter();
defaultActionHandlers[RemoveQueuedUnitConverter.type] =
  new RemoveQueuedUnitConverter();
defaultActionHandlers[0x27] = new SinglePlayerCheatResourceConverter();
defaultActionHandlers[Unknown21Converter.type] = new Unknown21Converter();
defaultActionHandlers[0x28] = new SinglePlayerCheatResourceConverter();
defaultActionHandlers[0x2d] = new SinglePlayerCheatResourceConverter();
defaultActionHandlers[0x2e] = new SinglePlayerCheatTimeConverter();
defaultActionHandlers[0x20] = new SinglePlayerCheatConverter();
defaultActionHandlers[0x22] = new SinglePlayerCheatConverter();
defaultActionHandlers[0x23] = new SinglePlayerCheatConverter();
defaultActionHandlers[0x24] = new SinglePlayerCheatConverter();
defaultActionHandlers[0x25] = new SinglePlayerCheatConverter();
defaultActionHandlers[0x26] = new SinglePlayerCheatConverter();
defaultActionHandlers[0x2a] = new SinglePlayerCheatConverter();
defaultActionHandlers[0x2b] = new SinglePlayerCheatConverter();
defaultActionHandlers[0x2c] = new SinglePlayerCheatConverter();
defaultActionHandlers[0x2f] = new SinglePlayerCheatConverter();
defaultActionHandlers[0x30] = new SinglePlayerCheatConverter();
defaultActionHandlers[0x31] = new SinglePlayerCheatConverter();
defaultActionHandlers[0x32] = new SinglePlayerCheatConverter();
defaultActionHandlers[AllyOptionsConverter.type] = new AllyOptionsConverter();
defaultActionHandlers[ResourceTransferConverter.type] =
  new ResourceTransferConverter();
defaultActionHandlers[ChatCommandConverter.type] = new ChatCommandConverter();
defaultActionHandlers[ESCKeyEventConverter.type] = new ESCKeyEventConverter();
defaultActionHandlers[Unknown62Converter.type] = new Unknown62Converter();
defaultActionHandlers[OpenSkillSubmenuConverter.type] =
  new OpenSkillSubmenuConverter();
defaultActionHandlers[OpenBuildSubmenuConverter.type] =
  new OpenBuildSubmenuConverter();
defaultActionHandlers[MinimapPingConverter.type] = new MinimapPingConverter();
defaultActionHandlers[Unknown69Converter.type] = new Unknown69Converter();
defaultActionHandlers[Unknown6aConverter.type] = new Unknown6aConverter();
defaultActionHandlers[SyncIntegerConverter.type] = new SyncIntegerConverter();
defaultActionHandlers[ArrowKeyConverter.type] = new ArrowKeyConverter();
defaultActionHandlers[UjSyncConverter.type] = new UjSyncConverter();

export interface ActionCommandBlock {
  playerId: number;
  actions: AbstractActionData[];
  remaingBuffer: Uint8Array;
}

export class ActionParser {
  private actionHandlers: AbstractActionConverter[];

  constructor(actionHandler?: AbstractActionConverter[]) {
    this.actionHandlers = actionHandler
      ? [...defaultActionHandlers, ...actionHandler]
      : defaultActionHandlers;
  }

  // Action payload

  public parse(bytebuffer: DataBuffer): ActionCommandBlock[] {
    const actionBlocks: ActionCommandBlock[] = [];

    while (bytebuffer.remaining()) {
      const playerId = bytebuffer.readUint8();
      const actionsLength = bytebuffer.readUint16();
      const actions: AbstractActionData[] = [];

      const currentBlockEnd = bytebuffer.offset + actionsLength;

      while (bytebuffer.offset < currentBlockEnd) {
        const actionId = bytebuffer.readUint8();

        if (this.actionHandlers[actionId]) {
          const result = this.actionHandlers[actionId].parse(bytebuffer);

          if (result) {
            actions.push(result);
          } else {
            bytebuffer.offset--;
            break;
          }
        } else {
          bytebuffer.offset--;
          break;
        }
      }

      const remaingBuffer = bytebuffer
        .slice(bytebuffer.offset, currentBlockEnd)
        .toBuffer();
      bytebuffer.offset = currentBlockEnd;

      actionBlocks.push({
        playerId,
        actions,
        remaingBuffer,
      });
    }

    return actionBlocks;
  }

  public assembly(actions: ActionCommandBlock[]) {
    const commandBlocks = new Array<Uint8Array>();

    actions.forEach((i) => {
      const actions = new Array<Uint8Array>();

      i.actions.forEach((j) => {
        if (this.actionHandlers[j.type]) {
          const result = this.actionHandlers[j.type].assembly(j);

          if (result) actions.push(result);
        }
      });

      actions.push(i.remaingBuffer);

      const actionsData = actions.reduce((acc, curr) => {
        const temp = new Uint8Array(acc.length + curr.length);
        temp.set(acc, 0);
        temp.set(curr, acc.length);
        return temp;
      }, new Uint8Array(0));

      // Build header

      const header = new DataBuffer(3, true);
      header.writeUint8(i.playerId);
      header.writeUint16(actionsData.byteLength);

      commandBlocks.push(Uint8Array.of(...header.buffer, ...actionsData));
    });

    return commandBlocks.reduce((acc, curr) => {
      const temp = new Uint8Array(acc.length + curr.length);
      temp.set(acc, 0);
      temp.set(curr, acc.length);
      return temp;
    }, new Uint8Array(0));
  }
}
